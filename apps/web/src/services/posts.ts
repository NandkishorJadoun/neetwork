import type { ActiveTab } from "../routes/_authenticated/home";

type FetchPostsArgs = {
  activeTab: ActiveTab;
  nextCursor: string;
};

export const fetchFeedPosts = async ({ activeTab, nextCursor }: FetchPostsArgs) => {
  const url = `api/posts?users=${activeTab}&cursor=${nextCursor}`;

  try {
    const res = await fetch(url, { credentials: "include" });
  }
  catch (error) {

  }
};
