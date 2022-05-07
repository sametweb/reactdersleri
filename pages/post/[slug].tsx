import { Playlist, Post as PostType } from "@prisma/client";
import Layout from "components/Layout";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import React, { useRef, useState } from "react";
import styles from "./Post.module.scss";
import ReactPlayer from "react-player/youtube";
import useWindow from "utils/useWindow";
import { getPost } from "dataHelpers/post";
import { getPlaylistWithVideos } from "dataHelpers/playlist";
import PostImage from "components/PostImage";
import classNames from "classnames";
import {
  ArrowsExpandIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { BaseReactPlayerProps } from "react-player/base";
import Duration from "components/Duration";
import Link from "next/link";

const playbackRateOptions = [1, 1.25, 1.5, 1.75, 2];

type ComponentProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Post: NextPage<ComponentProps> = (props) => {
  const [volume, setVolume] = useState(0.7);
  const [playerProps, setPlayerProps] = useState({
    playing: false,
    playbackRate: 1,
    width: "100%",
    height: "100%",
    seeking: false,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    duration: 0,
    volume,
    muted: false,
  });
  const [timeIndicator, setTimeIndicator] = useState<"elapsed" | "remaining">("elapsed");

  const [isPlaybackRateOpen, setIsPlaybackRateOpen] = useState(false);

  const hasWindow = useWindow();

  const { post, playlist } = props;

  const playerWrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  const getSelectedItemStyles = (id: number) =>
    classNames(styles.playlistItem, {
      [styles.playlistItemSelected]: post?.id === id,
    });

  const getPlaybackRateStyles = (isVisible: boolean) =>
    classNames({
      [styles.playbackRateOpen]: isVisible,
      [styles.playbackRateClosed]: !isVisible,
    });

  const togglePlay = () => setPlayerProps({ ...playerProps, playing: !playerProps.playing });

  const setPlaybackRate = (value: number) =>
    setPlayerProps({ ...playerProps, playbackRate: value });

  const makeFullScreen = () => playerWrapperRef.current?.requestFullscreen();

  const handleSeekMouseDown = () => {
    setPlayerProps({ ...playerProps, seeking: true });
  };

  const handleSeekChange = (e: any) => {
    setPlayerProps({ ...playerProps, played: parseFloat(e.target.value) });
  };

  const handleSeekMouseUp = (e: any) => {
    setPlayerProps({ ...playerProps, seeking: false });
    playerRef.current?.seekTo(parseFloat(e.target.value));
  };

  const handleProgress: BaseReactPlayerProps["onProgress"] = (state) => {
    if (!playerProps.seeking) {
      setPlayerProps({ ...playerProps, ...state });
    }
  };

  const handleDuration = (duration: number) => {
    console.log("onDuration", duration);
    setPlayerProps({ ...playerProps, duration });
  };

  const handleVolumeChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setPlayerProps({ ...playerProps, volume: value, muted: value > 0 ? false : playerProps.muted });
    setVolume(value);
  };

  const handleToggleMuted = () => {
    setPlayerProps({
      ...playerProps,
      muted: !playerProps.muted,
      volume: playerProps.muted ? (volume === 0 ? 0.7 : volume) : 0,
    });
  };

  const VolumeIcon = playerProps.muted || volume === 0 ? VolumeOffIcon : VolumeUpIcon;

  const toggleTimeIndicator = () => {
    setTimeIndicator(timeIndicator === "elapsed" ? "remaining" : "elapsed");
  };

  const played = timeIndicator === "elapsed" ? playerProps.played : 1 - playerProps.played;

  const handleSelectedPostScrollIntoView = (element: HTMLDivElement | null) => {
    element?.scrollIntoView();
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{post?.title}</h1>
        {hasWindow && (
          <div className={styles.playerContainer}>
            <div ref={playerWrapperRef} className={styles.playerWrapper}>
              <ReactPlayer
                ref={playerRef}
                onPlay={!playerProps.playing ? togglePlay : () => {}}
                onPause={playerProps.playing ? togglePlay : () => {}}
                {...playerProps}
                className={styles.player}
                url={post?.videoUrl ?? ""}
                onProgress={handleProgress}
                onDuration={handleDuration}
              />
            </div>
            <div className={styles.playlist}>
              {playlist?.posts.map((playlistPost) => {
                return (
                  <Link key={playlistPost.id} href={`/post/${playlistPost.slug}`} passHref>
                    <div
                      ref={(ref) => {
                        playlistPost.id === post?.id && handleSelectedPostScrollIntoView(ref);
                      }}
                      className={getSelectedItemStyles(playlistPost.id)}
                    >
                      {playlistPost.id === post?.id && (
                        <div className={styles.currentItemIndicator} />
                      )}
                      <PostImage post={playlistPost} width={125} height={70} />
                      <h2 className={styles.playlistItemTitle}>{playlistPost.title}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <div className={styles.controls}>
          <div className={styles.videoSide}>
            <div className={styles.seekbarContainer}>
              <input
                key={playerProps.played}
                className={styles.seekbar}
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={playerProps.played}
                style={{ "--percentage": `${playerProps.played * 100}` } as React.CSSProperties}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
            </div>
            <div className="flex flex-1 justify-between">
              <div className="flex items-center">
                <div className={styles.controlButton} onClick={togglePlay}>
                  {playerProps.playing ? (
                    <PauseIcon className="w-7" />
                  ) : (
                    <PlayIcon className="w-7" />
                  )}
                </div>
                <div className={styles.controlButton} onClick={toggleTimeIndicator}>
                  <Duration seconds={playerProps.duration * played} />
                </div>
              </div>
              <div className="flex items-center">
                <div className={styles.controlButton}>
                  <div className="flex">
                    <VolumeIcon className="w-7 mr-2" onClick={handleToggleMuted} />
                    <input
                      className={styles.volumebar}
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      value={playerProps.volume}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>
                <div
                  className={styles.controlButton}
                  onClick={() => setIsPlaybackRateOpen(!isPlaybackRateOpen)}
                >
                  <div className={styles.playbackRateWrapper}>
                    <FastForwardIcon className="w-7" /> {playerProps.playbackRate}x
                  </div>
                  <div className={getPlaybackRateStyles(isPlaybackRateOpen)}>
                    {playbackRateOptions.map((value) => (
                      <button
                        key={value}
                        className={styles.playbackRateOption}
                        onClick={() => setPlaybackRate(value)}
                      >
                        {value}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.controlButton}>
                  <ArrowsExpandIcon className="w-7" onClick={makeFullScreen} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.playlistSide}></div>
        </div>
      </div>
    </Layout>
  );
};

type ServerSideProps = GetServerSideProps<{
  post: PostType | null;
  playlist: (Playlist & { posts: PostType[] }) | null;
}>;

export const getServerSideProps: ServerSideProps = async ({ params }) => {
  let slug = "";
  if (params && typeof params.slug === "string") {
    slug = params.slug;
  }
  const post = await getPost(slug);
  let playlist = null;
  if (post && post.playlistId) {
    playlist = (await getPlaylistWithVideos(post.playlistId)) ?? null;
  }

  return {
    props: { post: post ?? null, playlist },
  };
};

export default Post;
