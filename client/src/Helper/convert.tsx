export default function convertToBase64(file: File | null): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    if (file) {
      fileReader.readAsDataURL(file);
    } else {
      reject("file is null");
    }
  });
}
