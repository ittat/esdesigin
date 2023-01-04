import NoSsr from '@mui/material/NoSsr';
import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Homes, { IHomesProps } from '../src/Homes';

const Apps: NextPage<IHomesProps> = () => <NoSsr><Homes  /></NoSsr>;
export default Apps;
