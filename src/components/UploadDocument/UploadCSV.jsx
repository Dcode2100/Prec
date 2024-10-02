import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { UploadCSVDocuments } from "../../api/api";

function UploadCSV({ status, buttonText, refetch = () => {} }) {
  const toast = useToast();
  const [fileNameAadharWeb, setFileNameAadharWeb] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [fileSizeAadhar, setFileSizeAadhar] = useState(100004800);
  const [showErrorAadhar, setShowErrorAadhar] = useState(false);
  const [sizeErrorAadhar, setSizeErrorAadhar] = useState(false);
  const handleChangeAadharWeb = async (e) => {
    setIsLoading(false);
    if (e.target.files.length > 0) {
      switch (e.target.name) {
        case "file":
          if (e.target.files[0]?.type === "text/csv") {
            if (e.target.files[0]?.size < fileSizeAadhar) {
              const fileToUploadAadhar = e.target.files[0];
              const formData = new FormData();
              formData.append(
                status === "PCACTIVE"
                  ? "accounts"
                  : status === "repay"
                  ? "holding"
                  : "order",
                fileToUploadAadhar
              );
              formData.append("logFileName", "orders");
              setIsLoading(true);
              try {
                const upload = await UploadCSVDocuments(formData, status);
                if (
                  upload?.statusCode === 200 &&
                  status !== "SUBSCRIPTION_PROCESSED"
                ) {
                  setShowErrorAadhar(false);
                  setSizeErrorAadhar(false);
                  setFileNameAadharWeb(e.target.files[0].name);
                  setIsLoading(false);
                  toast({
                    title: "Upload Successful",
                    status: "success",
                    isClosable: true,
                  });
                }
                if (status === "SUBSCRIPTION_PROCESSED") {
                  toast({
                    title: "Upload Successful",
                    status: "success",
                    isClosable: true,
                  });
                  refetch();
                  setIsLoading(false);
                }
              } catch (err) {
                setFileNameAadharWeb(false);
                setIsLoading(false);
              }
            } else {
              setSizeErrorAadhar(true);
              setFileNameAadharWeb("");
            }
          } else {
            setShowErrorAadhar(true);
            setFileNameAadharWeb("");
          }
          break;
        default:
          setFileNameAadharWeb(e.target.value);
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
              onChange={(event) => handleChangeAadharWeb(event)}
              onClick={(e) => {
                e.target.value = null;
              }}
              accept=".csv"
            />
          </div>
        </div>
        {showErrorAadhar ? (
          <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
            File Format Incorrect
          </div>
        ) : null}
        {sizeErrorAadhar ? (
          <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
            File Size Exceeds
          </div>
        ) : null}
      </div>
    </>
  );
}

export default UploadCSV;
