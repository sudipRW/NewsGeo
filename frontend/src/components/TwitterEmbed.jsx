import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const TwitterEmbed = ({ tweetUrl }) => {
  // Regular expression to extract the tweet ID
  const tweetIdRegex = /\/status\/(\d+)/;
  const match = tweetUrl.match(tweetIdRegex);

  // Check if the regex match was successful
  if (match && match[1]) {
    const tweetId = match[1];
    return (
      <div>
        <TwitterTweetEmbed tweetId={tweetId} />
      </div>
    );
  } else {
    // Handle the case where the tweet ID couldn't be extracted
    return <div>Error: Unable to extract tweet ID from URL</div>;
  }
};

export default TwitterEmbed;