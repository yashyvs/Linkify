import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiTwotoneDelete } from "react-icons/ai";
const Body = () => {
  const [inputLink, setInputLink] = useState("");
  const [shortId, setShortId] = useState("");
  const shortIdRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Retrieve recent searches from local storage on component load
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleShortenURL = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_BASE_URL, {
        url: inputLink,
      });
      // console.log(res.data.id);
      setShortId(res.data.id);
      const updatedSearches = [
        { id: res.data.id, search: inputLink },
        ...recentSearches,
      ].slice(0, 5); // Store the latest 5 searches
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (err) {
      console.error("Error shortening URL: ", err);
    }
  };
  const handleCopyLink = () => {
    if (shortIdRef.current) {
      shortIdRef.current.select();
      document.execCommand("copy");
      alert("Link copied to clipboard!");
    }
  };
  const handleDeleteSearch = (search) => {
    const updatedSearches = recentSearches.filter((s) => s.id !== search.id);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <div className="container mx-auto p-4 font-mono">
      <h2 className="text-3xl font-bold mb-4">Shorten a long link</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="font-bold text-2xl md:text-3xl">Paste a long URL</div>
        <input
          type="text"
          className="w-full border p-2 mb-2"
          placeholder="Enter your URL"
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
        />
        <button
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleShortenURL}
        >
          Shorten
        </button>
      </div>
      {shortId && (
        <div className="mt-4">
          <p className="text-xl font-semibold">Shortened ID:</p>
          <div className="flex">
            <input
              className="w-full border p-2"
              type="text"
              value={`${import.meta.env.VITE_BASE_URL}${shortId}`}
              ref={shortIdRef}
              readOnly
            />
            <button
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 ml-2 rounded"
              onClick={handleCopyLink}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <p className="text-xl font-semibold">Recent Searches:</p>
          <ul className="list-disc ml-8">
            {recentSearches.map((search, index) => (
              <li key={index}>
                <strong>URL: </strong>
                {search.search}
                <br />
                <strong>Shorten-URL: </strong>
                {import.meta.env.VITE_BASE_URL}
                {search.id}
                <AiTwotoneDelete
                  className="inline mx-2 md:my-2 md:mx-5 text-xl cursor-pointer"
                  onClick={() => handleDeleteSearch(search)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Body;
