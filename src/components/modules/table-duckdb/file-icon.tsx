import {
  ArchiveIcon,
  FileIcon as FileIconRadix,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

const FileIconComponent = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "csv":
    case "json":
    case "xml":
    case "txt":
    case "sql":
      return <FileTextIcon className="size-5 text-blue-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return <ImageIcon className="size-5 text-green-500" />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return <VideoIcon className="size-5 text-purple-500" />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
      return <ArchiveIcon className="size-5 text-orange-500" />;
    case "parquet":
      return <FileIconRadix className="size-5 text-indigo-500" />;
    default:
      return <FileIconRadix className="size-5 text-gray-500" />;
  }
};

export default FileIconComponent;
