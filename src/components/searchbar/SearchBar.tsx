'use client'
import { useRouter } from "next/navigation";

const SearchBar = () => {
   const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
   
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;  
    const query = inputElement.value;
    router.push(`/blog?search=${query}`);
  }
  return (
    <form onSubmit={handleSubmit} action="POST">
        <input type="text" placeholder="Search..." name='search' className="text-[16px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition w-full md:w-64" />
    </form>
  )
}

export default SearchBar