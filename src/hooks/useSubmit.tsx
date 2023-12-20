const useSubmit = () => {
  const handleSubmit = async (payload, url) => {
    setIsLoading(true);
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
