import { FaSearch } from "react-icons/fa";


function SearchInput(){


    return (
        <div>
            <form className="flex items-center gap-2">
                <input type="text" placeholder="Search.." className="input input-bordered rounded-full"/>
                <button type="sumit" className="btn btn-circle bg-sky-500 text-white">
                <FaSearch className="w-6 h-6 outline-none"/>
                </button>
            </form>

        </div>
    )
}


export default SearchInput;