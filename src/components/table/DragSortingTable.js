import React from 'react';
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './index.css';


class BodyRow extends React.Component {

  dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
  ) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
      return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
      return 'upward';
    }
  }

  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = this.dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

const columns = [{
  title: '',
  dataIndex: 'name',
  key: 'name'
}];

class DragSortingTable extends React.Component {
  state = {
    data: [{
      key: '1',
      name: 'Audio'
    }, {
      key: '2',
      name: 'Camera'
    }, {
      key: '3',
      name: 'Mobile'
    }],
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    
    /***
     * newData is new seq of data, after drag and Drop
     * 
     * ***/
    // const newData = update(this.state, {
    //   data: {
    //     $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    //   },
    // });

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  render() {
    return (
      <Table
        columns={columns}
        dataSource={this.state.data}
        rowSelection={this.rowSelection}
        components={this.components}
        pagination={false}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
    );
  }
}

const DraggableTable = DragDropContext(HTML5Backend)(DragSortingTable);

export default DraggableTable;