import { forwardRef, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import store from '~/store';
import { localize } from '~/localization/Translation';

const SearchBar = forwardRef((props, ref) => {
  const { clearSearch } = props;
  const [searchQuery, setSearchQuery] = useRecoilState(store.searchQuery);
  const [showClearIcon, setShowClearIcon] = useState(false);
  const lang = useRecoilValue(store.lang);

  const handleKeyUp = (e) => {
    const { value } = e.target;
    if (e.keyCode === 8 && value === '') {
      setSearchQuery('');
      clearSearch();
    }
  };

  const onChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    setShowClearIcon(value.length > 0);
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setShowClearIcon(false);
    } else {
      setShowClearIcon(true);
    }
  }, [searchQuery]);

  return (
    <div
      ref={ref}
      className="relative flex w-full cursor-pointer items-center gap-3 rounded-md border border-white/20 px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
    >
      {<Search className="absolute left-3 h-4 w-4" />}
      <input
        type="text"
        className="m-0 mr-0 w-full border-none bg-transparent p-0 pl-7 text-sm leading-tight outline-none"
        value={searchQuery}
        onChange={onChange}
        onKeyDown={(e) => {
          e.code === 'Space' ? e.stopPropagation() : null;
        }}
        placeholder={localize(lang, 'com_nav_search_placeholder')}
        onKeyUp={handleKeyUp}
      />
      <X
        className={`absolute right-3 h-5 w-5 cursor-pointer ${
          showClearIcon ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}
        onClick={() => {
          setSearchQuery('');
          clearSearch();
        }}
      />
    </div>
  );
});

export default SearchBar;
