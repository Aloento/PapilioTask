import { ModalForm } from '@ant-design/pro-components';
import { Button, Checkbox, Divider, Tooltip, Typography } from 'antd';
import React from 'react';

const { Text, Link } = Typography;

interface ColumnItem {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any) => React.ReactNode;
  filters?: { text: string; value: string }[];
  onFilter?: (value: any, record: any) => boolean;
  fixed?: 'left' | 'right';
}

// 列设置组件
const ColumnSettingModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  columns: ColumnItem[];
  visibleColumnKeys: string[];
  setVisibleColumnKeys: React.Dispatch<React.SetStateAction<string[]>>;
  columnFixedState: Record<string, 'left' | 'right' | undefined>;
  setColumnFixedState: React.Dispatch<React.SetStateAction<Record<string, 'left' | 'right' | undefined>>>;
}> = ({
  visible,
  onClose,
  columns,
  visibleColumnKeys,
  setVisibleColumnKeys,
  columnFixedState,
  setColumnFixedState,
}) => {

    const renderColumnSettingItem = (col: ColumnItem) => (
      <div key={col.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ cursor: 'grab', marginRight: 8, color: '#ccc' }}>⋮⋮</span>
        <Checkbox
          checked={visibleColumnKeys.includes(col.key)}
          onChange={(e) => {
            const checked = e.target.checked;
            setVisibleColumnKeys((prev) =>
              checked ? [...prev, col.key] : prev.filter((k) => k !== col.key),
            );
          }}
        >
          {col.title}
        </Checkbox>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Tooltip title="固定在列首">
            <Button
              size="small"
              type={columnFixedState[col.key] === 'left' ? 'primary' : 'text'}
              icon={<span style={{ fontSize: 12 }}>⤒</span>}
              onClick={() =>
                setColumnFixedState((prev) => ({
                  ...prev,
                  [col.key]: prev[col.key] === 'left' ? undefined : 'left',
                }))
              }
            />
          </Tooltip>
          <Tooltip title="固定在列尾">
            <Button
              size="small"
              type={columnFixedState[col.key] === 'right' ? 'primary' : 'text'}
              icon={<span style={{ fontSize: 12 }}>⤓</span>}
              onClick={() =>
                setColumnFixedState((prev) => ({
                  ...prev,
                  [col.key]: prev[col.key] === 'right' ? undefined : 'right',
                }))
              }
            />
          </Tooltip>
        </div>
      </div>
    );

    return (
      <ModalForm
        title="列设置"
        open={visible}
        onOpenChange={onClose}
        submitter={false}
        modalProps={{ destroyOnClose: true }}
      >
        <div style={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Checkbox
              checked={visibleColumnKeys.length === columns.length}
              indeterminate={
                visibleColumnKeys.length > 0 && visibleColumnKeys.length < columns.length
              }
              onChange={(e) => {
                const checked = e.target.checked;
                setVisibleColumnKeys(checked ? columns.map((col) => col.key) : []);
              }}
            >
              列展示
            </Checkbox>
            <Link
              onClick={() => {
                setVisibleColumnKeys(columns.map((col) => col.key));
                setColumnFixedState({});
              }}
            >
              重置
            </Link>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          {(['left', undefined, 'right'] as const).map((fixedType) => {
            const titleMap = {
              left: '固定在左侧',
              undefined: '不固定',
              right: '固定在右侧',
            } as const;

            return (
              <React.Fragment key={String(fixedType)}>
                {columns.some(
                  (col) =>
                    columnFixedState[col.key] === fixedType ||
                    (!columnFixedState[col.key] && fixedType === undefined),
                ) && (
                    <>
                      <Divider style={{ margin: '8px 0' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {titleMap[fixedType!]}
                      </Text>
                      {columns.map((col) =>
                        columnFixedState[col.key] === fixedType ||
                          (!columnFixedState[col.key] && fixedType === undefined)
                          ? renderColumnSettingItem(col)
                          : null,
                      )}
                    </>
                  )}
              </React.Fragment>
            );
          })}
        </div>
      </ModalForm>
    );
  };

export default ColumnSettingModal;
