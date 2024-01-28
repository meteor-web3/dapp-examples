import "./App.css";
import React, { useState, useEffect, useCallback } from "react";

import { Message } from "@arco-design/web-react";
import {
  useApp,
  useCreateIndexFile,
  useFeeds,
  useStore,
  useLoadActionFiles,
  useLoadFolders,
} from "@meteor-web3/hooks";
import { ModelParser, Output } from "@meteor-web3/model-parser";

import loadingIcon from "./assets/loading.svg";
import Post from "./components/Post";
import { addressAbbreviation, getAddressFromDid } from "./utils";
import app from "../output/app.json";

const postVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);

const App = () => {
  const postModel = modelParser.getModelByName("post");
  const postModelId = postModel.streams[postModel.streams.length - 1].modelId;
  const actionFileModel = modelParser.getModelByName("actionFile");
  const [postContent, setPostContent] = useState<string>();

  /**
   * @summary import from @meteor-web3/hooks
   */

  const { pkh, filesMap: posts } = useStore();
  const { loadFolders } = useLoadFolders();

  useEffect(() => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    loadFeeds();
  }, [postModel]);

  useEffect(() => {
    if (!actionFileModel) {
      console.error("actionFileModel undefined");
      return;
    }
    loadActionFiles();
  }, [actionFileModel]);

  useEffect(() => {
    if (!pkh) {
      return;
    }
    loadFolders();
  }, [pkh]);

  const { connectApp, isPending: isConnectAppPending } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
    onSuccess: result => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createIndexFile, isPending: isCreatePostPending } =
    useCreateIndexFile({
      onSuccess: result => {
        console.log("[createFile]create file success:", result);
      },
    });

  const { loadFeeds } = useFeeds({
    model: postModel,
    onError: error => {
      console.error("[loadPosts]load files failed,", error);
    },
    onSuccess: result => {
      console.log("[loadPosts]load files success, result:", result);
    },
  });

  const { loadActionFiles } = useLoadActionFiles({
    model: actionFileModel,
    onError: error => {
      console.error("[loadActionFiles]load files failed,", error);
    },
    onSuccess: result => {
      console.log("[loadActionFiles]load files success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp();
  }, [connectApp]);

  const createPost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!postContent) {
      Message.info("Post content cannot be empty");
      return;
    }
    if (!pkh) {
      await connectApp();
    }

    createIndexFile({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      fileName: "create file test",
      fileContent: {
        modelVersion: postVersion,
        text: postContent,
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }, [postModel, createIndexFile]);

  return (
    <>
      <div className='header'>
        <div>Social Network</div>
        <button onClick={connect} className='connect-container'>
          <>
            {pkh ? (
              addressAbbreviation(getAddressFromDid(pkh))
            ) : (
              <div className='connect-box'>
                {isConnectAppPending && <img src={loadingIcon} />}
                connect
                {isConnectAppPending && <div className='placeholder' />}
              </div>
            )}
          </>
        </button>
      </div>
      <div className='body'>
        <div className='left'>
          <textarea
            placeholder='Post...'
            onChange={e => setPostContent(e.target.value)}
            className='create-post-input'
          />
          <button onClick={createPost} className='create-post'>
            {isCreatePostPending && <img src={loadingIcon} />}
            <div className='text'>createPost</div>
            {isCreatePostPending && <div className='placeholder'></div>}
          </button>
        </div>
        <div className='right'>
          {posts?.[postModelId] &&
            Object.values(posts[postModelId])
              .sort(
                (a, b) => Date.parse(b.createdAt!) - Date.parse(a.createdAt!),
              )
              .map((post, index) => <Post post={post} key={index} />)}
        </div>
      </div>
    </>
  );
};

export default App;
