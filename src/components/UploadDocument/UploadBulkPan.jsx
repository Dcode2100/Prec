import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { UploadBulkPanDocument } from "../../api/api";

function UploadBulkPan({ buttonText }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState("");
  const [fileSize, setFileSize] = useState(100004800);
  const [showError, setShowError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const handleUpload = async (e) => {
    setIsLoading(false);
    if (e.target.files.length > 0) {
      switch (e.target.name) {
        case "file":
          if (e.target.files[0]?.type === "text/csv") {
            if (e.target.files[0]?.size < fileSize) {
              const fileToUploadAadhar = e.target.files[0];
              const formData = new FormData();
              formData.append("pan_updates", fileToUploadAadhar);
              formData.append("log_file_name", "pan");
              setIsLoading(true);
              try {
                const upload = await UploadBulkPanDocument(formData);
                if (upload?.statusCode === 200) {
                  setShowError(false);
                  setSizeError(false);
                  setIsLoading(false);
                  toast({
                    title: "Upload Successful",
                    status: "success",
                    isClosable: true,
                  });
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
          setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="mb-20">
        <div className="flexBox">
          <div className="upload-btn-wrapper">
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              loadingText="Uploading"
            >
              {buttonText}
            </Button>
            <input
              id="file2"
              type="file"
              className="hidden"
              name="file"
              disabled={isLoading}
              onChange={(event) => handleUpload(event)}
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
    </>
  );
}

export default UploadBulkPan;
