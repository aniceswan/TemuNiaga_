import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

/**
 * Streams a CSV file and invokes onBatch with backpressure: the next chunk of
 * rows is only pulled once the previous batch's async handler has resolved.
 * An error thrown by onBatch (e.g. a failed createMany) always rejects the
 * returned promise, even if it happens in the final batch after the
 * underlying stream has already emitted "end".
 */
export async function readCsvBatches<T = Record<string, string>>(
  filePath: string,
  batchSize: number,
  onBatch: (rows: T[]) => Promise<void>,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const parser = createReadStream(filePath).pipe(
      parse({ columns: true, skip_empty_lines: true }),
    );

    let batch: T[] = [];
    let total = 0;
    let chain = Promise.resolve();
    let settled = false;

    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      parser.destroy();
      reject(err);
    };

    const flush = (rows: T[]) => {
      chain = chain.then(() => onBatch(rows)).catch(fail);
    };

    parser.on("data", (row: T) => {
      batch.push(row);
      total++;
      if (batch.length >= batchSize) {
        flush(batch);
        batch = [];
      }
    });

    parser.on("end", () => {
      if (batch.length) flush(batch);
      chain.then(() => {
        if (!settled) {
          settled = true;
          resolve(total);
        }
      });
    });

    parser.on("error", (err) => fail(err));
  });
}
