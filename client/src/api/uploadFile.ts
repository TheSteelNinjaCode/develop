// import { v4 as uuidv4 } from "uuid";

// export type percentageType = {
//   message: string;
//   number: number;
// };

// export type setPercentageType = React.Dispatch<
//   React.SetStateAction<percentageType>
// >;
// export const uploadFile = async (
//   file: File,
//   setPercentage: setPercentageType,
//   abortController: AbortController
// ) => {
//   try {
//     const fileName = uuidv4();
//     const bucket = "exma-output"; // For File content
//     const key = `files/${file.type.split("/")[0]}/${fileName}.${
//       file.type.split("/")[1]
//     }`;

//     await fileReaderAndUpload(
//       file,
//       setPercentage,
//       abortController,
//       bucket,
//       key
//     );
//     return key;
//   } catch (error) {
//     return { message: "Error", error };
//   }
// };

// const fileReaderAndUpload = async (
//   file: File,
//   setPercentage: setPercentageType,
//   abortController: AbortController,
//   bucket: string,
//   key: string
// ) => {
//   const urlSigned = await apiWithOutToken.post(`/getSignedUrl`, {
//     key,
//     bucket,
//   });

//   await axios
//     .request({
//       method: "put",
//       headers: {
//         "Content-Disposition": `attachment; filename= ${file.name}`,
//       },
//       signal: abortController.signal,
//       url: urlSigned.data.urlSigned,
//       data: file,
//       onUploadProgress: (p: any) => {
//         // const loaded = Math.round(p.loaded / 100000) / 10 || 0
//         // const total = Math.round(p.total / 100000) / 10 || 0
//         const rate = Math.round(p.rate / 10000) / 100 || 0;
//         const progress = p.progress.toFixed(2) * 100 || 0;
//         setPercentage({
//           message: `Uploading ${file.name}:\xa0\xa0 Rate: ${rate} MB/s \xa0\xa0`,
//           number: Math.floor(progress),
//         });
//       },
//     })
//     .then((data) => {
//       setPercentage({
//         message: `Uploaded ${file.name} to server!`,
//         number: 100,
//       });
//       return "Uploaded succesfully";
//     });
//   return "Uploaded succesfully";
// };
