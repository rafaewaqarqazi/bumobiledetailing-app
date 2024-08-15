import React from 'react';

const Page = () => (
  <pre>
    {JSON.stringify(
      { ok: true, ts: process.env.GIT_SHA_TS, sha: process.env.GIT_SHA },
      null,
      2,
    )}
  </pre>
);

export default Page;
