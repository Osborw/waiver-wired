import Layout from '../components/MyLayout';
import Row from '../components/Row'
import {getSomething} from '../db/getStuff'

const Index = (props) =>  {
  return (
    <Layout>
      <p>Hello Next.js</p>
      {props.ret.map((p, idx) => {
        return <Row key={idx+1} rank={idx+1} name={p.name} avg={p.avg_points}/>
      })}
    </Layout>
  );
}

Index.getInitialProps = async function() {

  const ret = await getSomething()
  return {
    ret: ret
  }
};

export default Index;