import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import type { ConversationListResponse } from 'librechat-data-provider';
import {
  useMediaQuery,
  useAuthContext,
  useConversation,
  useLocalStorage,
  useNavScrolling,
} from '~/hooks';
import { useSearchInfiniteQuery, useConversationsInfiniteQuery } from '~/data-provider';
import { TooltipProvider, Tooltip } from '~/components/ui';
import { Spinner } from '~/components/svg';
import NavToggle from './NavToggle';
import NavLinks from './NavLinks';
import { cn } from '~/utils';
import store from '~/store';
import AdminMenu from './AdminMenu';

export default function AdminNav({ navVisible, setNavVisible }) {
  const { isAuthenticated } = useAuthContext();

  const [navWidth, setNavWidth] = useState('260px');
  const [isHovering, setIsHovering] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [newUser, setNewUser] = useLocalStorage('newUser', true);
  const [isToggleHovering, setIsToggleHovering] = useState(false);

  useEffect(() => {
    if (isSmallScreen) {
      setNavWidth('320px');
    } else {
      setNavWidth('260px');
    }
  }, [isSmallScreen]);

  const [pageNumber] = useState(1);
  const [showLoading, setShowLoading] = useState(false);

  const searchQuery = useRecoilValue(store.searchQuery);
  const { searchPlaceholderConversation } = useConversation();

  const setSearchResultMessages = useSetRecoilState(store.searchResultMessages);

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationsInfiniteQuery(
    { pageNumber: pageNumber.toString() },
    { enabled: isAuthenticated },
  );

  const searchQueryRes = useSearchInfiniteQuery(
    { pageNumber: pageNumber.toString(), searchQuery: searchQuery },
    { enabled: isAuthenticated && !!searchQuery.length },
  );

  const { containerRef } = useNavScrolling({
    setShowLoading,
    hasNextPage: searchQuery ? searchQueryRes.hasNextPage : hasNextPage,
    fetchNextPage: searchQuery ? searchQueryRes.fetchNextPage : fetchNextPage,
    isFetchingNextPage: searchQuery ? searchQueryRes.isFetchingNextPage : isFetchingNextPage,
  });

  const onSearchSuccess = useCallback(({ data }: { data: ConversationListResponse }) => {
    const res = data;
    searchPlaceholderConversation();
    setSearchResultMessages(res.messages);
    /* disabled due recoil methods not recognized as state setters */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  useEffect(() => {
    //we use isInitialLoading here instead of isLoading because query is disabled by default
    if (searchQueryRes.data) {
      onSearchSuccess({ data: searchQueryRes.data.pages[0] });
    }
  }, [searchQueryRes.data, searchQueryRes.isInitialLoading, onSearchSuccess]);

  const toggleNavVisible = () => {
    setNavVisible((prev: boolean) => !prev);
    if (newUser) {
      setNewUser(false);
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <div
          className={
            'nav active dark max-w-[320px] flex-shrink-0 overflow-x-hidden bg-black md:max-w-[260px]'
          }
          style={{
            width: navVisible ? navWidth : '0px',
            visibility: navVisible ? 'visible' : 'hidden',
            transition: 'width 0.2s, visibility 0.2s',
          }}
        >
          <div className="h-full w-[320px] md:w-[260px]">
            <div className="flex h-full min-h-0 flex-col">
              <div
                className={cn(
                  'flex h-full min-h-0 flex-col transition-opacity',
                  isToggleHovering && !isSmallScreen ? 'opacity-50' : 'opacity-100',
                )}
              >
                <div
                  className={cn(
                    'scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20',
                  )}
                >
                  <nav className="flex h-full w-full flex-col px-3 pb-3.5">
                    <div
                      className={cn(
                        '-mr-2 flex-1 flex-col overflow-y-auto pr-2 transition-opacity duration-500',
                        isHovering ? '' : 'scrollbar-transparent',
                      )}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      ref={containerRef}
                    >
                      <AdminMenu />

                      <Spinner
                        className={cn(
                          'm-1 mx-auto mb-4 h-4 w-4',
                          isFetchingNextPage || showLoading ? 'opacity-1' : 'opacity-0',
                        )}
                      />
                    </div>
                    <NavLinks />
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavToggle
          isHovering={isToggleHovering}
          setIsHovering={setIsToggleHovering}
          onToggle={toggleNavVisible}
          navVisible={navVisible}
        />
        <div className={`nav-mask${navVisible ? ' active' : ''}`} onClick={toggleNavVisible} />
      </Tooltip>
    </TooltipProvider>
  );
}
