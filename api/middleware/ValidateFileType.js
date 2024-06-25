const validateFileType = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["xls", "xlsx"].includes(ext)) return "excel";
  if (["doc", "docx"].includes(ext)) return "docx";
  else return ""
}


module.exports = { validateFileType }