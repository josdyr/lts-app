interface SubmitHook {
  handleSubmit: (payload: any, url: string) => Promise<void>;
}

const useSubmit = (): SubmitHook => {
  const handleSubmit = async (payload: any, url: string): Promise<void> => {
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTPS error! Status: ${response.status}`);
      } else {
        console.log("Create");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return { handleSubmit };
};

export default useSubmit;
