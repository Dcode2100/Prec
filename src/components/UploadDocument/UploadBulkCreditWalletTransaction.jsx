import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadBulkCreditWalletTransactions } from "@/lib/api/transactionsApi";

function UploadBulkAsset({ buttonText, refetch = () => {} }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fileSize] = useState(100004800);
  const [showError, setShowError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    setIsLoading(false);
    if (e.target.files.length > 0) {
      switch (e.target.name) {
        case "file":
          if (e.target.files[0]?.type === "text/csv") {
            if (e.target.files[0]?.size < fileSize) {
              const fileToUpload = e.target.files[0];
              const formData = new FormData();
              formData.append("file", fileToUpload);
              setIsLoading(true);
              try {
                const upload = await UploadBulkCreditWalletTransactions(formData);
                if (upload?.statusCode === 200) {
                  toast({
                    title: "Upload Successful",
                    description: "Your file has been uploaded successfully.",
                  });
                  refetch();
                  setIsLoading(false);
                }
              } catch (err) {
                setIsLoading(false);
              }
            } else {
              setSizeError(true);
            }
          } else {
            setShowError(true);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="">
      <div className="flexBox">
        <div className="upload-btn-wrapper">
          <Button
            isloading={isLoading}
            isDisabled={isLoading}
            loadingText="Uploading"
            onClick={handleButtonClick}
            className="px-4 py-2 text-white"
          >
            {buttonText}
          </Button>
          <input
            ref={fileInputRef}
            id="file2"
            type="file"
            className="hidden"
            name="file"
            disabled={isLoading}
            onChange={(event) => handleChange(event)}
            onClick={(e) => {
              e.target.value = null;
            }}
            accept=".csv"
          />
        </div>
      </div>
      {showError ? (
        <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
          File Format Incorrect
        </div>
      ) : null}
      {sizeError ? (
        <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
          File Size Exceeds
        </div>
      ) : null}
    </div>
  );
}

export default UploadBulkAsset;
