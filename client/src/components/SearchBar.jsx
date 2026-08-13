import {
MdSearch,
MdClear
} from "react-icons/md";


const SearchBar=({
value,
onChange,
placeholder="Search notes...",
onClear
})=>{


return(

<div className="search-container">


<MdSearch className="search-icon"/>


<input

value={value}

onChange={(e)=>onChange(e.target.value)}

placeholder={placeholder}

/>


{
value &&

<button
onClick={onClear}
className="clear-search"
>

<MdClear/>

</button>

}



</div>

)

}


export default SearchBar;