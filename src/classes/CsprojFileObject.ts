export class CsprojFileObject {
  filePath: string;
  fileName: string;
  projectName: string;

  constructor(csprojFilePath: string = "", csprojFileName: string = "") {
    this.filePath = csprojFilePath;
    this.fileName = csprojFilePath.replace(`\\${csprojFileName}`, "");
    this.projectName = csprojFileName.replace(".csproj", "");
  }
}
