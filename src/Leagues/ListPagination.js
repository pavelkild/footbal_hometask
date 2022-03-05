import { Component } from "react";
import PageLink from './PageLink';

class ListPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {ready: true};
    }

    render() {
        let pages = this.props.pages,
            curPage = this.props.curPage,
            maxPage = this.props.maxPage,
            nextPage = (curPage === maxPage) ? curPage : curPage + 1,
            prevPage = (curPage === 1) ? curPage : curPage - 1;

        return (
            <div className="paginationContainer text-center" onClick={this.props.cbFunc}>
                {<PageLink key={"pageLink_prev"} link={prevPage} type="prev" addClass={prevPage===curPage ? 'disabled' : ''} />}
                {pages.map(page => <PageLink key={"pageLink_" + page} link={page} current={curPage} type={page} />)}
                {<PageLink key={"pageLink_next"} link={nextPage} type="next" addClass={nextPage===curPage ? 'disabled' : ''} />}
            </div>
        )
    }
}

export default ListPagination