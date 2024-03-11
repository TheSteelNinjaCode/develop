import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaFilePen, FaTrashCan } from "react-icons/fa6";
import { useUserAuthStore } from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc/client";
import { toast } from "sonner";

type S3File = {
  filename: string;
  size: number;
  type: string;
  url: string;
  lastModified: string;
};

export default function Dashboard() {
  const editFileNameModal = useRef<HTMLDialogElement>(null);
  const deleteFileModal = useRef<HTMLDialogElement>(null);
  const userAuthStore = useUserAuthStore();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<S3File>();
  const [newFileName, setNewFileName] = useState<string>("");
  const [uploadInputKey, setUploadInputKey] = useState(Date.now());

  useEffect(() => {
    if (!userAuthStore?.userProfile?.id) {
      navigate("/login");
    }
  }, [userAuthStore, navigate]);

  const s3UploadFile = trpc.file.uploadFile.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Uploading...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      s3Files.refetch();

      toast.success(`File uploaded successfully: ${data?.fileName}`, {
        id: context,
      });
      setSelectedFile(null); // Reset selected file after upload
      setUploadInputKey(Date.now()); // Reset input key to clear the file input
    },
    onError: (error, _, context) => {
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });
    },
  });
  const s3Files = trpc.file.readFiles.useQuery();
  const s3UpdateFileName = trpc.file.updateFileName.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Procesando...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      s3Files.refetch();
      editFileNameModal.current?.close();
      toast.success(`File name updated to ${data?.newFileName}`, {
        id: context,
      });
      setNewFileName("");
    },
    onError: (error, _, context) => {
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });
    },
  });
  const s3DeleteFile = trpc.file.deleteFile.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Procesando...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      s3Files.refetch();
      deleteFileModal.current?.close();
      toast.success(`File delete success ${data?.fileName}`, {
        id: context,
      });
    },
    onError: (error, _, context) => {
      if (error instanceof Error)
        toast.error(error.message, {
          id: context,
        });
    },
  });

  const closeSession = () => {
    userAuthStore?.logout();
    navigate("/login");
  };

  const updateFileName = async () => {
    try {
      if (currentFile?.filename !== "" && newFileName !== "") {
        const oldFileName = currentFile?.filename || "";

        let newFileNameModified = newFileName;
        if (!newFileName.includes(".")) {
          newFileNameModified = `${newFileName}.${currentFile?.type}`;
        }

        if (newFileNameModified === oldFileName) {
          return;
        }

        await s3UpdateFileName.mutateAsync({
          oldFileName,
          newFileName: newFileNameModified,
        });
      } else {
        toast.error("Invalid file names");
      }
    } catch (error) {
      toast.error(`Error updating file name ${currentFile?.filename}`);
    }
  };

  const deleteFile = async () => {
    try {
      if (currentFile?.filename !== "") {
        const fileName = currentFile?.filename || "";
        await s3DeleteFile.mutateAsync({ fileName });
      } else {
        toast.error("Invalid file name");
      }
    } catch (error) {
      toast.error(`Error deleting file ${currentFile?.filename}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",").pop();

      if (!base64String) {
        toast.error("Failed to read file");
        return;
      }

      s3UploadFile.mutateAsync({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileContentBase64: base64String,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <>
      <div className="grid place-items-center w-screen h-screen">
        <div>
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <p>User: {userAuthStore.userProfile.name}</p>
              <button
                className="btn btn-sm btn-neutral"
                onClick={closeSession}
                type="button"
              >
                Close Session
              </button>
            </div>
            <Link to="/unsplash" className="btn btn-sm btn-neutral w-fit">
              Ir a Unsplash
            </Link>
          </div>
          <h1 className="font-semibold text-2xl mb-4">File Manager</h1>
          <div className="flex gap-4 mb-4">
            <input
              key={uploadInputKey}
              type="file"
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleFileChange}
            />
            <button className="btn btn-sm btn-neutral" onClick={uploadFile}>
              Upload
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows table-pin-cols">
              <thead>
                <tr>
                  <th></th>
                  <td>File</td>
                  <td>Size</td>
                  <td>Type</td>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {s3Files.data?.map((file, index) => {
                  let fileSize = "";
                  if (file.size) {
                    const size = file.size;
                    const i = Math.floor(Math.log(size) / Math.log(1024));
                    const num = size / Math.pow(1024, i);
                    const round = Math.round(num * 100) / 100;
                    fileSize = `${round} ${"KMGTPEZY"[i - 1]}B`;
                  }

                  return (
                    <tr key={index}>
                      <th>{++index}</th>
                      <td>
                        <div className="flex gap-2 items-center">
                          <img
                            className="w-7 h-7 rounded-md drop-shadow-md border"
                            src={file.url}
                            alt={file.filename}
                          />
                          <span className="w-80 truncate">{file.filename}</span>
                        </div>
                      </td>
                      <td>{fileSize}</td>
                      <td>{file.type}</td>
                      <th>
                        <div className="flex gap-1">
                          <Link
                            to={file.url}
                            target="_blank"
                            className="btn btn-sm btn-ghost"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => {
                              setCurrentFile(file as S3File);
                              editFileNameModal.current?.showModal();
                            }}
                            className="btn btn-sm btn-ghost"
                          >
                            <FaFilePen />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentFile(file as S3File);
                              deleteFileModal.current?.showModal();
                            }}
                            className="btn btn-sm btn-ghost"
                          >
                            <FaTrashCan />
                          </button>
                        </div>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit File Modal */}
      <dialog ref={editFileNameModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => setNewFileName("")}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Edit</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="file-name">
              Current File Name: {currentFile?.filename}
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="New File Name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <button
              onClick={updateFileName}
              type="submit"
              className="btn btn-neutral self-end"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* Delete File Modal */}
      <dialog ref={deleteFileModal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Delete</h3>
          <div className="flex flex-col gap-2">
            <label htmlFor="file-name">
              File Name: {currentFile?.filename}
            </label>
            <p>Are you sure you want to delete this file?</p>
            <button
              onClick={deleteFile}
              type="submit"
              className="btn btn-neutral self-end"
            >
              Accept
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
