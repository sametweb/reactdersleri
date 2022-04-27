// global
import type { GetServerSideProps, NextPage } from "next";

// local
import Layout from "components/Layout";
import Carousel from "components/Carousel";
import styles from "styles/Home.module.css";
import { getPlaylists } from "./api/playlists";

// types
import type { InferGetServerSidePropsType } from "next";
import { Playlist, Post } from "@prisma/client";

type ComponentProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<ComponentProps> = (props) => {
  const { playlists } = props;

  return (
    <Layout>
      <div className={styles.container}>
        {playlists.map((playlist) => (
          <Carousel
            key={playlist.id}
            playlist={playlist}
            posts={playlist.posts}
          />
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  playlists: (Playlist & { posts: Post[] })[];
}> = async () => {
  const playlists = await getPlaylists();

  return {
    props: {
      playlists,
    },
  };
};

export default Home;
