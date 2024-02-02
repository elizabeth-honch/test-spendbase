import React, { useState } from 'react';
import folders from '../../../data/folders.json';
import { Button, Input, Select } from 'antd';
import styles from './styles.module.scss';

const { Search } = Input;

export const FolderHeader = ({
  setSearchingView,
  setFolderData,
  setRole,
}) => {
  const [search, setSearch] = useState('');

  const onSearch = (value) => {
    setSearchingView(!!value.length);
    if (value.length > 0) {
      const valueToLowerCase = value.toLowerCase();
      setFolderData(
        folders
          .filter(folderObj => folderObj.name
            .toLowerCase()
            .includes(valueToLowerCase)
          ).map(folderObj => ({...folderObj, search: true}))
      );
    } else {
      setFolderData(folders);
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const handleChangeType = (value) => {
    setRole(value);
    handleSearch({target: ''});
  };

  const resetFolders = () => {
    setFolderData(folders);
    handleSearch({target: ''});
  };

  return (
    <div className={styles.header}>
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        size="small"
        style={{ width: 200 }}
        onChange={handleSearch}
        value={search}
      />
      
      <Select
        defaultValue="user"
        style={{ width: 120 }}
        size="small"
        onChange={handleChangeType}
        options={[
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
        ]}
      />

      <Button
        size="small"
        type="primary"
        onClick={resetFolders}
      >
        Reset
      </Button>
    </div>
  );
};
