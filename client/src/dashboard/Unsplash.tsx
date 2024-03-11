import { useState } from "react";
import { trpc } from "../trpc/client";
import useDebounce from "../hooks/useDebounce";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type UnsplashImage = {
  id: string;
  description: string;
  url: string;
};

export default function Unsplash() {
  const [query, setQuery] = useState("");
  const debounceSearch = useDebounce(query);

  const unspalshSearch = trpc.unspalsh.search.useQuery({
    query: debounceSearch || "nature",
  });

  const s3UploadFile = trpc.file.uploadFileFromUnsplash.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Uploading...");
      return toastId;
    },
    onSuccess: (data, _, context) => {
      toast.success(`File uploaded successfully: ${data?.fileName}`, {
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

  const handleImageUpload = (image: UnsplashImage) => {
    s3UploadFile.mutate({
      imageUrl: image.url,
      imageName: image.description,
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-x-hidden">
      <h1 className="text-2xl font-bold mt-8 text-center">Unsplash images</h1>
      <Link className="text-center" to="/dashboard">
        go to dashboard
      </Link>
      <div className="p-4">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                className="w-full input input-bordered"
                placeholder="Search for images..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Search Unsplash for free high-resolution photos. Example: coffee,
              wallpapers, nature, business
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {unspalshSearch.isLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full"></div>
          ) : (
            unspalshSearch.data?.map((image) => (
              <div
                key={image.id}
                className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 relative"
              >
                <img
                  alt={image.description || "Unsplash Image"}
                  className="object-cover w-full h-full"
                  src={image.url}
                  loading="lazy"
                />
                <button
                  onClick={() => handleImageUpload(image as UnsplashImage)}
                  className="btn btn-neutral absolute bottom-0 w-full rounded-none opacity-90"
                  type="button"
                >
                  Upload to S3
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
