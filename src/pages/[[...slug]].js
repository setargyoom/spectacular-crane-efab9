import React from 'react';
import _ from 'lodash';
import { sourcebitDataClient } from 'sourcebit-target-next';
import { withRemoteDataUpdates } from 'sourcebit-target-next/with-remote-data-updates';

import pageLayouts from '../layouts';

import Image from 'next/image'
import profilePic from '../public/me.png'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

class Page extends React.Component {
    render() {
        const modelName = _.get(this.props, 'page.__metadata.modelName');
        const PageLayout = pageLayouts[modelName];
        if (!PageLayout) {
            throw new Error(`no page layout matching the page model: ${modelName}`);
        }
        return <PageLayout {...this.props} />;
    }
}

export async function getStaticPaths() {
    console.log('Page [...slug].js getStaticPaths');
    const paths = await sourcebitDataClient.getStaticPaths();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    console.log('Page [...slug].js getStaticProps, params: ', params);
    const pagePath = '/' + (params.slug ? params.slug.join('/') : '');
    const props = await sourcebitDataClient.getStaticPropsForPageAtPath(pagePath);
    return { props };
}

export default withRemoteDataUpdates(Page);
