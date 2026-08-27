import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  filename?: string;
  data?: any[];
  label?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  filename = "export.csv",
  data = [],
  label = "Export CSV",
  variant = "outline",
  size = "sm",
}) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    try {
      const keys = Object.keys(data[0]);
      const csvRows = [
        keys.join(","),
        ...data.map((row) =>
          keys
            .map((k) => {
              const val = row[k];
              const str = typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${data.length} records to ${filename}`);
    } catch (err) {
      toast.error("Failed to generate export file.");
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleExport} className="h-9 gap-1.5 text-xs font-medium">
      <Download className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
};
