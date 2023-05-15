import axios from 'axios';
import { stopwords } from './utils/stopwords';
import dotenv from 'dotenv';
dotenv.config();
import { getSentiment } from './services/getSentiment';
import moment from 'moment';
import { getDailyAverage } from './services/getDailyAverage';

const apiKey = process.env.NEWS_API_KEY;

const url: string = `https://newsapi.org/v2/everything?q=*&from=2023-04-011&to=2023-05-12&sortBy=popularity&pageSize=100&apiKey=${apiKey}`;

interface NewsItem {
  description: string;
  date_time: Date;
  sentiment: number;
  source: string;
}

interface DataItem {
  id: string;
  data: Array<{ x: string; y: number }>;
}

const scrapeResponse = async () => {
  console.log('scraperesponse');
  try {
    const response = await axios.get(url);
    const responseData = response.data;

    let dataBySource: DataItem[] = [];
    for (let i = 0; i < responseData.articles.length; i++) {
      const article = responseData.articles[i];
      let found = false;
      for (let j = 0; j < dataBySource.length; j++) {
        if (dataBySource[j].id === article.source.name) {
          dataBySource[j].data.push({
            x: article.publishedAt.split('T')[0],
            y: getSentiment(article.description),
          });
          found = true;
          break;
        }
      }
      if (!found) {
        dataBySource.push({
          id: article.source.name,
          data: [
            {
              x: article.publishedAt.split('T')[0],
              y: getSentiment(article.description),
            },
          ],
        });
      }
    }

    for (let i = 0; i < dataBySource.length; i++) {
      console.log(dataBySource[i]);
      dataBySource[i]['data'].sort((a, b) => moment(a.x).diff(moment(b.x)));
      dataBySource[i]['data'] = getDailyAverage(dataBySource[i]['data']);
    }

    return dataBySource;

    // const postData = response.data.data.children.map((post: any) => {
    //   return post.data.title;
    // });
    // return { success: true, postData: postData };
  } catch (err) {
    console.log(err);
    // return { success: false, postData: [] };
  }
};

export { scrapeResponse };
