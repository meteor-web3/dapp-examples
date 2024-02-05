import "./App.css";
import React, { useState, useCallback, useEffect } from "react";

import { ChainId } from "@arcstone/arcstone-sdk";
import { DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES } from "@arcstone/arcstone-sdk/data-token";
import { Connector, MeteorWebProvider } from "@meteor-web3/connector";
import {
  useApp,
  useCollectFile,
  useCreateIndexFile,
  useLoadDataTokens,
  useFeedsByAddress,
  useMonetizeFile,
  useStore,
  useUnlockFile,
  useUpdateIndexFile,
} from "@meteor-web3/hooks";
import { ModelParser, Output } from "@meteor-web3/model-parser";
import ReactJson from "react-json-view";

import app from "../output/app.json";

const postVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);
const chainId = ChainId.PolygonMumbai;

const App = () => {
  const postModel = modelParser.getModelByName("post");
  const [currentFileId, setCurrentFileId] = useState<string>();

  /**
   * @summary import from @meteor-web3/hooks
   */

  const { pkh, filesMap: posts, setConnector } = useStore();

  useEffect(() => {
    setConnector(new Connector(new MeteorWebProvider()));
  }, []);

  const { connectApp } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
    onSuccess: result => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createdIndexFile, createIndexFile } = useCreateIndexFile({
    onSuccess: result => {
      console.log("[createFile]create file success:", result);
      setCurrentFileId(result.fileContent.file.fileId);
    },
  });

  const {
    createdIndexFile: createdEncryptedFile,
    createIndexFile: createEncryptedFile,
  } = useCreateIndexFile({
    onSuccess: result => {
      console.log(
        "[createEncryptedFile]create encrypted file success:",
        result,
      );
      setCurrentFileId(result.fileContent.file.fileId);
    },
  });

  const { loadFeedsByAddress } = useFeedsByAddress({
    model: postModel,
    onError: error => {
      console.error("[loadPosts]load files failed,", error);
    },
    onSuccess: result => {
      console.log("[loadPosts]load files success, result:", result);
    },
  });

  const { updatedFileContent: updatedPost, updateIndexFile } =
    useUpdateIndexFile({
      onSuccess: result => {
        console.log("[updateFile]update file success, result:", result);
      },
    });

  const { monetizedFileContent: monetizedPost, monetizeFile } = useMonetizeFile(
    {
      onSuccess: result => {
        console.log("[monetize]monetize file success, result:", result);
      },
    },
  );

  const { dataTokenInfos, loadDataTokens } = useLoadDataTokens({
    onSuccess: result => {
      console.log(
        "[dataTokenInfos]get dataToken info success, result:",
        result,
      );
    },
  });

  const { collectedFileContent: collectedPost, collectFile } = useCollectFile({
    onSuccess: result => {
      console.log("[collectFile]collect file success, result:", result);
    },
  });

  const { unlockedFileContent: unlockedPost, unlockFile } = useUnlockFile({
    onSuccess: result => {
      console.log("[unlockPost]unlock file success, result:", result);
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

    createIndexFile({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      fileName: "create file test",
      fileContent: {
        modelVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }, [postModel, createIndexFile]);

  const createEncryptedPost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    createEncryptedFile({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      fileName: "create file test",
      fileContent: {
        modelVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        encrypted: {
          text: true,
          images: true,
          videos: false,
        },
      },
    });
  }, [postModel, createEncryptedFile]);

  const loadPosts = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh) {
      console.error("pkh undefined");
      return;
    }

    await loadFeedsByAddress(pkh);
  }, [postModel, pkh, loadFeedsByAddress]);

  const updatePost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    updateIndexFile({
      fileId: currentFileId,
      fileName: "update file test",
      fileContent: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  }, [currentFileId, updateIndexFile]);

  const monetizePost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }

    await monetizeFile({
      fileId: currentFileId,
      chainId,
      actionsConfig: {
        collectAction: {
          currency: TOKEN_DEPLOYED_ADDRESSES[chainId].WMATIC,
          amount: 1000,
        },
      },
    });
  }, [currentFileId, monetizeFile]);

  const getDataTokenInfoByFileId = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    loadDataTokens([currentFileId]);
  }, [loadDataTokens, currentFileId]);

  const collectPost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    collectFile({ fileId: currentFileId });
  }, [collectFile]);

  const unlockPost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    unlockFile(currentFileId);
  }, [unlockFile]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className='black-text'>{pkh}</div>
      <hr />
      <button onClick={createPost}>createPost</button>
      {createdIndexFile && (
        <div className='json-view'>
          <ReactJson src={createdIndexFile} collapsed={true} />
        </div>
      )}
      <button onClick={createEncryptedPost}>createEncryptedPost</button>
      {createdEncryptedFile && (
        <div className='json-view'>
          <ReactJson src={createdEncryptedFile} collapsed={true} />
        </div>
      )}
      <button onClick={loadPosts}>loadPosts</button>
      {posts && (
        <div className='json-view'>
          <ReactJson src={posts} collapsed={true} />
        </div>
      )}
      <button onClick={updatePost}>updatePost</button>
      {updatedPost && (
        <div className='json-view'>
          <ReactJson src={updatedPost} collapsed={true} />
        </div>
      )}
      <button onClick={monetizePost}>monetizePost</button>
      {monetizedPost && (
        <div className='json-view'>
          <ReactJson src={monetizedPost} collapsed={true} />
        </div>
      )}
      <button onClick={getDataTokenInfoByFileId}>dataTokenInfos</button>
      {dataTokenInfos?.[0] && (
        <div className='json-view'>
          <ReactJson src={dataTokenInfos[0]} collapsed={true} />
        </div>
      )}
      <br />
      <div className='red'>
        You need to switch another account to collect the post and unlock the
        post.
      </div>
      <button onClick={collectPost}>collectPost</button>
      {collectedPost && (
        <div className='json-view'>
          <ReactJson src={collectedPost} collapsed={true} />
        </div>
      )}
      <button onClick={unlockPost}>unlockPost</button>
      {unlockedPost && (
        <div className='json-view'>
          <ReactJson src={unlockedPost} collapsed={true} />
        </div>
      )}
      <br />
    </>
  );
};

export default App;
