import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText } from "lucide-react";

export function FormatNotice() {
  return (
    <Alert>
      <FileText className="h-4 w-4" />
      <AlertTitle>YAML Format</AlertTitle>
      <AlertDescription>
        Die Statblocks verwenden die Fantasy Statblocks Syntax. Mehr
        Informationen findest du in der{" "}
        <a
          href="https://plugins.javalent.com/statblock/layouts/integrated/dnd5e"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Dokumentation
        </a>
        .
      </AlertDescription>
    </Alert>
  );
}
