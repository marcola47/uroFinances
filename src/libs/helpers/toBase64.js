export default function toBase64(file)
{
  return new Promise((resolve, reject) => 
  {
    const reader = new FileReader();
    reader.onloadend = () => { resolve(reader.result.split(',')[1]) };
    reader.onerror = (error) => { reject(error) };
    reader.readAsDataURL(file);
  });
};