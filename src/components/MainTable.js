import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainTableItem from "./MainTableItem";
import { connect } from "react-redux";
import * as exts from "utils/extTypes";
import * as act from "store/pagination/actions";

const MainTable = (props) => {
  const [fileInfos, setFileInfos] = useState(
    props.fileInfos.map((fi) => Object.assign(fi, { showInfo: false }))
  );
  const [selectAll, setSelectAll] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const { updateTotalRecords, updateTotalPages, updatePageNeighbours } = props;
  const { pageLimit, currentPage, pageNeighbours } = props.pagination;

  useEffect(() => {
    const fe = props.filterExt;
    const fi = props.fileInfos;
    switch (fe) {
      case exts.ALL:
        setFileInfos(fi);
        break;
      default:
        setFileInfos(
          fi.filter((fileInfo) => {
            return fe.includes(fileInfo.name.split(".").pop());
          })
        );
        break;
    }
  }, [props.fileInfos, props.filterExt]);

  useEffect(() => {
    let totalRecords = fileInfos.length;
    let totalPages = Math.ceil(totalRecords / pageLimit);
    const offset = (currentPage - 1) * pageLimit;
    const currentFiles = fileInfos.slice(offset, offset + pageLimit);
    updateTotalRecords(totalRecords);
    updateTotalPages(totalPages);
    updatePageNeighbours(Math.max(0, Math.min(pageNeighbours, 2)));
    setCurrentFiles(currentFiles);
  }, [currentPage, fileInfos, pageLimit, pageNeighbours, updatePageNeighbours, updateTotalPages, updateTotalRecords]);

  const handleShowInfo = (id) => {
    setFileInfos(
      fileInfos.map((fi) =>
        fi.id === id
          ? { ...fi, showInfo: !fi.showInfo }
          : { ...fi, showInfo: false }
      )
    );
  };

  return (
    <table className="normalTb" style={{ marginBottom: 15 }}>
      <colgroup>
        <col width="*" />
        <col width={100} />
        <col width={100} />
        <col width={60} />
        <col width={150} />
        <col width={70} />
        <col width={100} />
      </colgroup>
      <thead>
        <tr>
          <th>
            <div className="allCheck">
              <span>
                <label className={selectAll ? "i_check c_on" : "i_check"}>
                  <input
                    type="checkbox"
                    defaultChecked={selectAll}
                    onChange={() => {
                      setSelectAll(!selectAll);
                    }}
                  />
                </label>
              </span>
              <Link className="icoSort" to="/">
                File Name
              </Link>
            </div>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Owner
            </Link>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Modifier
            </Link>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Size
            </Link>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Security Level
            </Link>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Version
            </Link>
          </th>
          <th>
            <Link className="icoSort" to="/">
              Date Modified
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {currentFiles.map((fileInfo) => (
          <MainTableItem
            key={fileInfo.id}
            selectAll={selectAll}
            fileInfo={fileInfo}
            handleShowInfo={handleShowInfo}
          />
        ))}
      </tbody>
    </table>
  );
};

const mapStateToProps = (state) => {
  return {
    fileInfos: state.fileInfoReducers,
    pagination: state.paginationReducers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTotalRecords: (totalRecords) =>
      dispatch(act.updateTotalRecords(totalRecords)),
    updateTotalPages: (totalPages) =>
      dispatch(act.updateTotalPages(totalPages)),
    updatePageNeighbours: (pageNeighbours) =>
      dispatch(act.updatePageNeighbours(pageNeighbours)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainTable);