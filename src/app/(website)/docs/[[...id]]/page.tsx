import { Metadata } from 'next';
import path from 'node:path';
import { getFile } from '@/lib/content';
import Markdown from '@/components/Markdown';
import PageLinks from '../components/PageLinks';
import styles from './page.module.css';
import config from '../config.json';

const FOLDER = path.resolve(process.cwd(), './src/content/docs');

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string[] };
}): Promise<Metadata> {
  const name = id?.length ? id.join('/') : 'index';
  const doc = await getFile(name, FOLDER);

  return {
    title: {
      absolute: `${doc?.title} – Umami`,
      default: 'Umami',
    },
  };
}

export default async function ({ params: { id = [] } }: { params: { id: string[] } }) {
  const name = id?.length ? id.join('/') : 'index';
  const doc = await getFile(name, FOLDER);

  if (!doc) {
    return <h1>Page not found</h1>;
  }

  let group = null;
  Object.keys(config.navigation).find(key => {
    group = config.navigation[key]?.find(group => {
      return group.pages.find(
        page => page.url === `/docs/${name}` || (page.url === `/docs` && name === 'index'),
      );
    });
    return group;
  });

  console.log('GROUPPP', name, group);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.group}>{group?.group}</div>
        <div className={styles.title}>{doc?.title}</div>
        <Markdown>{doc?.body}</Markdown>
      </div>
      <PageLinks items={doc?.anchors} offset={150} />
    </div>
  );
}
