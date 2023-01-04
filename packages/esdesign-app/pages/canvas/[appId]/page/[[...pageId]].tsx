import type { GetServerSideProps, NextPage } from 'next';
import { withRouter } from 'next/router';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import AppCanvas from '../../../../src/AppCanvas';

interface IProps {
    pageId:string
}

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {

    const pageId = context.query.pageId as string
 
    if (!pageId[0]) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
           pageId: pageId[0]
        }
    };
};

const App: NextPage = (props) => <AppCanvas {...props} />;
export default App;