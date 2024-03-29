import React, { ReactNode } from "react";
import { Container, Header, Ref } from "semantic-ui-react";
import HistoryOptions from "@/components/history/HistoryOptions";
import BannerTable from "@/components/history/BannerTable";
import { BannerHistoryDataset, FeaturedHistory } from "@/banners/types";
import ScrollContainer from "react-indiana-drag-scroll";
import PngDownloadButton from "@/components/PngDownloadButton";
import _ from "lodash";

type Properties = {
  dataset: BannerHistoryDataset;
  featuredList: FeaturedHistory[];
  bannerType: string;
  title: ReactNode;
};

type States = {
  sortBy: string;
  order: string;
};

export default class HistoryPage extends React.Component<Properties, States> {
  private componentRef: React.RefObject<any>;

  constructor(props: Readonly<Properties> | Properties) {
    super(props);

    this.state = {
      sortBy: "last",
      order: "desc",
    };

    this.componentRef = React.createRef();
  }

  componentDidMount = () => {
    const sortBy = localStorage.getItem("history_sort");
    const order = localStorage.getItem("history_order");

    if (sortBy == "last" || sortBy == "first" || sortBy == "runs-last") {
      this.setState({
        sortBy,
      });
    }

    if (order == "asc" || order == "desc") {
      this.setState({
        order,
      });
    }
  };

  render() {
    const { featuredList, bannerType, dataset } = this.props;

    const { sortBy, order } = this.state;

    const setSortBy = (v: string) => {
      this.setState({ sortBy: v });
      localStorage.setItem("history_sort", v);
    };
    const setOrder = (v: string) => {
      this.setState({ order: v });
      localStorage.setItem("history_order", v);
    };

    return (
      <>
        <Container style={{ marginTop: "1em" }}>
          <Header size={"large"} as={"h1"}>
            {this.props.title}
          </Header>

          <p>
            This page shows the banner history of featured characters/weapons.
            By default it sorts by when the featured character/weapon was last
            run, but you can also sort it by when the character/weapon was first
            run (in order), or by the total number of times it was run.
          </p>

          <p>
            For search/filtering you can input a comma separated list of names,
            and/or versions that you are interested in. For example you can
            search {'"'}
            <code>aya</code>
            {'"'} in the 5 star character history page to show the history of
            characters with {'"aya"'} in their name, such as Ayato and Ayaka.
            More over you can search {'"'}
            <code>3.6, 3.2, 2.1, 2.5</code>
            {'"'} to show all characters/weapons that were run in versions 2.1,
            2.5, 3.2, and 3.6.
          </p>

          <HistoryOptions
            order={order}
            setOrder={setOrder}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </Container>
        <Container style={{ marginTop: "1em" }}>
          <ScrollContainer
            className="scroll-container"
            hideScrollbars={false}
            ignoreElements={"input"}
          >
            <Ref innerRef={this.componentRef}>
              <BannerTable
                bannerType={bannerType}
                dataset={dataset}
                featuredList={featuredList}
                order={order}
                sortBy={sortBy}
              />
            </Ref>
          </ScrollContainer>
        </Container>
        <Container style={{ marginTop: "2em" }} textAlign={"center"}>
          <PngDownloadButton
            node={this.componentRef}
            name={"banner-history"}
            type={bannerType}
          />
        </Container>
      </>
    );
  }
}
