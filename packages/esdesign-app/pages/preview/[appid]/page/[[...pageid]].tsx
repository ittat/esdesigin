import type { GetServerSideProps, NextPage } from 'next';
import { withRouter } from 'next/router';
import Preview from '../../../../src/preview/Preview';
import * as React from 'react';
import { useParams } from 'react-router-dom';


const App: NextPage = (props) => <Preview {...props} />;
export default App;