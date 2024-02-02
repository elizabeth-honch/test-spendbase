import folders from '../../data/folders.json';
import React, { useState, useRef } from 'react';
import {
  FolderFilled,
  FileOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  AppstoreOutlined,
  DeleteOutlined,
} from  '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { FolderHeader } from './Header';

export const Folder = () => {
  const [folderData, setFolderData] = useState(folders);
  const [searchingView, setSearchingView] = useState(false);
  const [role, setRole] = useState('user');
  const dragItem = useRef();
  const dragOverItem = useRef();

  const findAllParents = (data, elem, parents) => {
    if (elem.hasOwnProperty('parent')) {
      parents.push(elem.key);
      const parentElem = data.find(el => el.key === elem.parent);
      findAllParents(data, parentElem, parents);
    } else {
      parents.push(elem.key);
      return;
    }
  };

  const findAllNestedChildren = (data, elem, children) => {
    data.forEach(el => {
      if (el.parent === elem.key) {
        children.push(el.key);
        findAllNestedChildren(data, el, children);
      } else {
        return;
      }
    });
  };

  const folderEmptyNestedData = (key) => {
    const child = folderData.find(data => data?.parent === key);
    return !child;
  };

  const handleOpenFolder = (folder) => {
    setFolderData(prevFolderdata => {
      const rootParents = [];
      const allChildren = [];
      findAllParents(prevFolderdata, folder, rootParents);
      if (folder.open) {
        findAllNestedChildren(prevFolderdata, folder, allChildren);
      }
      return prevFolderdata.map(el => {
        // Current item
        if (el.key === folder.key) {
          return {
            ...el,
            show: true,
            open: !el.open,
            active: true,
          };
        }
        // Nested children
        if (el.parent === folder.key) {
          return {
            ...el,
            show: !el.show,
            active: true,
            open: false,
          };
        }

        // HightLight root parent
        if (
          rootParents.length > 0 &&
          rootParents.includes(el.key)
        ) {
          return {
            ...el,
            active: true,
          };
        }

        //Close all nested children
        if (
          allChildren.length > 0 &&
          allChildren.includes(el.key)
        ) {
          return {
            ...el,
            open: false,
            show: false,
            active: false,
          };
        }

        // Remove highlight
        return {
          ...el,
          active: false,
        };
      });
    });
  };

  const handleDeleteItem = (key) => {
    setFolderData(prevFolderData => {
      return prevFolderData.filter(
        folder => folder.key !== key
      );
    });
  };

  const onDragStart = (index) => {
    dragItem.current = index;
  };

  const onDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleSortingItems = (item) => {
    setFolderData(prevFolderData => {
      const result = [...prevFolderData];
      const childrenKeys = [item.key];
      findAllNestedChildren(prevFolderData, item, childrenKeys);
      const draggedItems = result.splice(dragItem.current, childrenKeys.length);
      draggedItems.forEach((draggedItem, index) => {
        result.splice(dragOverItem.current + index, 0, draggedItem);
      });
      return result;
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <main>
      <FolderHeader
        setSearchingView={setSearchingView}
        setFolderData={setFolderData}
        setRole={setRole}
      />

      <div className={styles.item__list}>
        {folderData.map((folder, index) => (
          <React.Fragment key={folder.key}>
            {(
              folder.show ||
              folder?.search ||
              folder.key.length === 1
            ) && (
              <div
                key={folder.key}
                className={clsx(
                  styles.item,
                  folder.active && styles.item__activeBlock,
                  !folder.roles.includes(role) && styles.item__disableBlock
                )}
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragEnd={() => handleSortingItems(folder)}
                draggable
              >
                <div className={styles.item__block}>
                  <Button
                    type="text"
                    size="small"
                    icon={<AppstoreOutlined />}
                    className={clsx(
                      styles.item__btn,
                      styles.item__moveBtn,
                    )}
                    disabled={!folder.roles.includes(role)}
                  />

                  <div
                    className={styles.item__block}
                    style={
                      folder?.search
                      ? {}
                      : { marginLeft: `${folder.key.length * 10}px`}
                    }
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={folder.open ? <CaretDownOutlined /> : <CaretRightOutlined />}
                      className={clsx(
                        styles.item__btn,
                        (
                          folder.type === 'file' ||
                          folderEmptyNestedData(folder.key) ||
                          searchingView ||
                          !folder.roles.includes(role)
                        ) && styles.item__hideBtn
                      )}
                      onClick={() => handleOpenFolder(folder)}
                      disabled={!folder.roles.includes(role)}
                    />

                    {folder.type === 'folder'
                      ? <FolderFilled style={{ color: '#F3B95F' }} />
                      : <FileOutlined style={{ color: '#647D87' }} />
                    }
                    
                    <span className={styles.item__name}>
                      {folder.name}
                    </span>
                  </div>
                </div>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!folder.roles.includes(role)}
                  className={styles.item__deleteBtn}
                  onClick={() => handleDeleteItem(folder.key)}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
};
