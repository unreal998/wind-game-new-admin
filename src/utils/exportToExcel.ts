import { type TableColumn } from "@/types/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { utils, writeFile } from "xlsx-js-style";

interface ExportToExcelOptions {
  data: Record<string, any>[];
  columns: TableColumn<any>[];
  filename?: string;
}

export const exportToExcel = (
  { data, columns, filename }: ExportToExcelOptions,
) => {
  try {
    const exportData = data.map((row) => {
      const rowData: Record<string, any> = {};
      columns.forEach((column) => {
        if (column.meta?.exportValue) {
          const header = column.meta.exportHeader ||
            (typeof column.header === "string"
              ? column.header
              : String(column.id));
          const value = column.meta.exportValue(row);
          rowData[header] = value;
        }
      });
      return rowData;
    });

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");

    // Встановлюємо базові стилі для всієї таблиці
    const range = utils.decode_range(worksheet["!ref"] || "A1:Z1");

    // Стилі для звичайних рядків
    for (let row = 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = utils.encode_cell({ r: row, c: col });
        if (!worksheet[cell]) continue;

        // Зберігаємо оригінальне значення
        const value = worksheet[cell].v;

        // Оновлюємо комірку зі стилями
        worksheet[cell] = {
          v: value, // значення
          t: typeof value === "number" ? "n" : "s", // тип
          s: {
            font: {
              name: "Arial",
              sz: 12,
            },
            alignment: {
              vertical: "center",
              // horizontal: "left",
            },
          },
        };
      }
    }

    // Стилі для заголовків
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cell]) continue;

      const value = worksheet[cell].v;
      const column = columns.find(
        (c) =>
          c.meta?.exportHeader === value ||
          (typeof c.header === "string" && c.header === value),
      );

      worksheet[cell] = {
        v: value,
        t: "s",
        s: {
          font: {
            name: "Arial",
            bold: true,
            sz: 12,
            color: { rgb: "000000" },
          },
          fill: {
            fgColor: { rgb: "F3F4F6" },
            patternType: "solid",
          },
          alignment: {
            vertical: "center",
            horizontal: column?.meta?.exportAlign || "left",
            wrapText: true,
          },
          border: {
            right: { color: { rgb: "E5E7EB" } },
            bottom: { style: "medium", color: { rgb: "E5E7EB" } },
          },
        },
      };
    }

    // Встановлюємо висоту тільки для заголовка
    worksheet["!rows"] = [{ hpt: 35 }];

    // Встановлюємо ширину колонок
    worksheet["!cols"] = columns
      .filter((column) => column.meta?.exportValue)
      .map((column) => ({
        wch: column.meta?.exportWidth || Math.max(
              column.meta?.exportHeader?.length ||
                (typeof column.header === "string" ? column.header.length : 10),
              ...Object.values(exportData).map((row) =>
                String(
                  row[
                    column.meta?.exportHeader ||
                    (typeof column.header === "string"
                      ? column.header
                      : String(column.id))
                  ],
                ).length
              ),
            ) * 1.2,
      }));

    const defaultFilename = `export_${format(new Date(), "dd.MM.yyyy")}.xlsx`;
    writeFile(workbook, filename || defaultFilename);

    toast.success("Дані успішно експортовано");
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Помилка при експорті даних",
    );
    console.error("Export error:", error);
  }
};
