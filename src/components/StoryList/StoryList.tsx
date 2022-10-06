import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import moment, { Moment } from 'moment';
import { Button as AntButton, Cascader, DatePicker, Input, message, Pagination, Popconfirm, Switch } from 'antd';
import { FileExcelFilled, LockOutlined, SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import filter from 'lodash/filter';
import qs from 'qs';
import { json2csv } from 'json-2-csv';

import './StoryList.scss';
import { useInstance } from 'react-ioc';
import ApiClient, { IFilter, StoryStatus } from '../../Api/ApiClient';
import Button from '../Button';
import ClipLoader from 'react-spinners/ClipLoader';
import StoryListItem from '../StoryListItem/StoryListItem';
import StoryListItemHeader from '../StoryListItem/StoryListItemHeader';
import Select from 'react-select';
import { formatStatusOptionLabel } from '../StatusOption/StatusOption';
import { ADMIN, AUTHOR, EDITOR, GUEST } from '../../helpres/roles';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ISelectOption } from '../SelectInput/SelectInput';
import dateAndTime from 'date-and-time';
import { ICascaderOption } from '../CascaderInput/AsyncCascaderInput';
import { RangeValue } from 'rc-picker/lib/interface';

const pageSizeOptions = [
  '50',
  '100',
  '500',
  '1000',
];

function showTotal(total: number) {
  return `Total ${total} items`;
}

const getStatusOptions = (role: string) => {
  if (role === AUTHOR) {
    const statusOptions: IStatusFilterSelectOption[] = [
      {
        value: StoryStatus.DRAFT,
        label: StoryStatus.DRAFT,
      },
      {
        value: StoryStatus.REJECTED,
        label: StoryStatus.REJECTED,
      },
      {
        value: StoryStatus.WAIT_FOR_APPROVE,
        label: StoryStatus.WAIT_FOR_APPROVE,
      },
    ];

    return statusOptions;
  }

  if (role === EDITOR) {
    const statusOptions: IStatusFilterSelectOption[] = [
      {
        value: StoryStatus.WAIT_FOR_APPROVE,
        label: StoryStatus.WAIT_FOR_APPROVE,
      },
      {
        value: StoryStatus.REJECTED,
        label: StoryStatus.REJECTED,
      },
      {
        value: StoryStatus.APPROVED,
        label: StoryStatus.APPROVED,
      },
      {
        value: StoryStatus.WAIT_PROOFREADING_OF_PAID,
        label: StoryStatus.WAIT_PROOFREADING_OF_PAID,
      },
      {
        value: StoryStatus.IN_PROOFREADING_OF_PAID,
        label: StoryStatus.IN_PROOFREADING_OF_PAID,
      },
      {
        value: StoryStatus.PROOFREADING_OF_PAID_DONE,
        label: StoryStatus.PROOFREADING_OF_PAID_DONE,
      },
      {
        value: StoryStatus.TRASH,
        label: StoryStatus.TRASH,
      },
      {
        value: StoryStatus.FOR_DELETION,
        label: StoryStatus.FOR_DELETION,
      },
    ];

    return statusOptions;
  }

  if (role === ADMIN) {
    const statusOptions: IStatusFilterSelectOption[] = [
      {
        value: StoryStatus.WAIT_FOR_APPROVE,
        label: StoryStatus.WAIT_FOR_APPROVE,
      },
      {
        value: StoryStatus.APPROVED,
        label: StoryStatus.APPROVED,
      },
      {
        value: StoryStatus.PAYMENT_IN_PROGRESS,
        label: StoryStatus.PAYMENT_IN_PROGRESS,
      },
      {
        value: StoryStatus.PAID,
        label: StoryStatus.PAID,
      },
      {
        value: StoryStatus.REJECTED,
        label: StoryStatus.REJECTED,
      },
      {
        value: StoryStatus.PAYMENT_ERROR,
        label: StoryStatus.PAYMENT_ERROR,
      },
      {
        value: StoryStatus.WAIT_PROOFREADING_OF_PAID,
        label: StoryStatus.WAIT_PROOFREADING_OF_PAID,
      },
      {
        value: StoryStatus.IN_PROOFREADING_OF_PAID,
        label: StoryStatus.IN_PROOFREADING_OF_PAID,
      },
      {
        value: StoryStatus.PROOFREADING_OF_PAID_DONE,
        label: StoryStatus.PROOFREADING_OF_PAID_DONE,
      },
      {
        value: StoryStatus.TO_BUILD,
        label: StoryStatus.TO_BUILD,
      },
      {
        value: StoryStatus.IN_BUILD,
        label: StoryStatus.IN_BUILD,
      },
      {
        value: StoryStatus.TEMPLATE,
        label: StoryStatus.TEMPLATE,
      },
      {
        value: StoryStatus.TRASH,
        label: StoryStatus.TRASH,
      },
      {
        value: StoryStatus.FOR_DELETION,
        label: StoryStatus.FOR_DELETION,
      },
    ];

    return statusOptions;
  }

  throw new Error('Unknown role');
};

interface IStatusFilterSelectOption {
  value: StoryStatus,
  label: StoryStatus,
}

interface IAuthorFilterSelectOption {
  value: string,
  label: string,
}

interface IEditorFilterSelectOption {
  value: string,
  label: string,
}

interface IProps {
  search: string;
}

const buildSearchString = (
  status: IStatusFilterSelectOption | undefined,
  page: number,
  perPage: number,
  author: IAuthorFilterSelectOption | undefined,
  editor: IEditorFilterSelectOption | undefined,
  text: string,
  categoryFilter: string[] | undefined,
  startDate: Moment | null,
  endDate: Moment | null,
  templateAvailable: boolean,
  startDatePR: Moment | null,
  endDatePR: Moment | null,
) => {
  const res: any = {};
  if (page) {
    res.page = page;
  }
  if (perPage) {
    res.perPage = perPage;
  }
  if (status) {
    res.status = status.value;
  }

  if (status && status.value === StoryStatus.TEMPLATE) {
    res.templateAvailable = templateAvailable;
  }

  if (author) {
    res.author = author;
  }

  if (editor) {
    res.editor = editor;
  }

  if (text) {
    res.text = text;
  }

  if (categoryFilter) {
    res.category = categoryFilter;
  }

  if (startDate) {
    res.start = startDate.format('YYYY-MM-DD');
  }

  if (endDate) {
    res.end = endDate.format('YYYY-MM-DD');
  }

  if (startDatePR) {
    res.startPR = startDatePR.format('YYYY-MM-DD');
  }

  if (endDatePR) {
    res.endPR = endDatePR.format('YYYY-MM-DD');
  }

  if (!Object.values(res)) {
    return '';
  }

  return `?${qs.stringify(res)}`;
};

const getStatusFromSearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.status) {
    return {
      value: searchValues.status,
      label: searchValues.status,
    };
  }

  return undefined;
};

const getAuthorFromSearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.author) {
    return searchValues.author;
  }

  return undefined;
};

const getEditorFromSearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.editor) {
    return searchValues.editor;
  }

  return undefined;
};

const getTextSearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.text) {
    return String(searchValues.text);
  }

  return undefined;
};

const getCategorySearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.category) {
    return searchValues.category;
  }

  return undefined;
};

const getTemplateAvailableSearch = (searchValues: qs.ParsedQs) => {
  if (searchValues.templateAvailable) {
    return searchValues.templateAvailable === 'true';
  }

  return true;
};


const getDatesSearch = (searchValues: qs.ParsedQs) => {
  const dates: RangeValue<Moment> = [ null, null ];

  if (searchValues.start) {
    const string = String(searchValues.start);
    const start = moment(string);
    if (start.isValid()) {
      dates[0] = start;
    }
  }

  if (searchValues.end) {
    const string = String(searchValues.end);
    const end = moment(string);
    if (end.isValid()) {
      dates[1] = end;
    }
  }

  return dates;
};

const getDatesSearchPR = (searchValues: qs.ParsedQs) => {
  const dates: RangeValue<Moment> = [ null, null ];

  if (searchValues.startPR) {
    const string = String(searchValues.startPR);
    const start = moment(string);
    if (start.isValid()) {
      dates[0] = start;
    }
  }

  if (searchValues.endPR) {
    const string = String(searchValues.endPR);
    const end = moment(string);
    if (end.isValid()) {
      dates[1] = end;
    }
  }

  return dates;
};

const disabledDate = (current: Moment) => {
  const now = new Date();

  if (current.valueOf() > now.getTime()) {
    return true;
  }

  // 22.10.2021
  return current.valueOf() < 1634830596899;
};

const StoryList: FC<IProps> = ({ search }) => {
  const searchValues = qs.parse(search, { ignoreQueryPrefix: true });

  const initialStatus = getStatusFromSearch(searchValues);
  const initialAuthor = getAuthorFromSearch(searchValues);
  const initialEditor = getEditorFromSearch(searchValues);
  const initialText = getTextSearch(searchValues) || '';
  const initialCategory = getCategorySearch(searchValues);
  const initialDates = getDatesSearch(searchValues);
  const initialDatesPR = getDatesSearchPR(searchValues);
  const initialTemplateAvailable = getTemplateAvailableSearch(searchValues);

  const apiClient = useInstance(ApiClient);
  const [ templateAvailable, setTemplateAvailable ] = useState<boolean>(initialTemplateAvailable);
  // @ts-ignore
  const [ status, setStatus ] = useState<IStatusFilterSelectOption | undefined>(initialStatus);
  // @ts-ignore
  const [ categoryFilter, setCategoryFilter ] = useState<string[] | undefined>(initialCategory);
  // @ts-ignore
  const [ author, setAuthor ] = useState<IAuthorFilterSelectOption | undefined>(initialAuthor);// @ts-ignore
  const [ editor, setEditor ] = useState<IAuthorFilterSelectOption | undefined>(initialEditor);

  const [ startDate, setStartDate ] = useState<Moment | null>(initialDates[0]);
  const [ endDate, setEndDate ] = useState<Moment | null>(initialDates[1]);

  const [ startDatePR, setStartDatePR ] = useState<Moment | null>(initialDatesPR[0]);
  const [ endDatePR, setEndDatePR ] = useState<Moment | null>(initialDatesPR[1]);

  const [ page, setPage ] = useState(Number(searchValues?.page) || 1);
  const [ text, setText ] = useState<string>(initialText);
  const [ inputTextValue, setInputTextValue ] = useState<string>(initialText);
  const [ perPage, setPerPage ] = useState(Number(searchValues?.perPage) || 50);

  const [ categoryPopupVisible, setCategoryPopupVisible ] = useState(false);

  // @ts-ignore
  const [ category, setCategory ] = useState<string[]>(initialCategory || []);

  const onChangeRange = (values: RangeValue<Moment>) => {
    if (!values) {
      setStartDate(null);
      setEndDate(null);

      return;
    }

    setStartDate(values[0]);
    setEndDate(values[1]);
    setPage(1);
  };

  const onChangeRangePR = (values: RangeValue<Moment>) => {
    if (!values) {
      setStartDatePR(null);
      setEndDatePR(null);

      return;
    }

    setStartDatePR(values[0]);
    setEndDatePR(values[1]);
    setPage(1);
  };

  const history = useHistory();

  useEffect(() => {
    if (!categoryPopupVisible) {
      setCategoryFilter(category);
      setPage(1);
    }
  }, [ categoryPopupVisible, category, setCategoryFilter ]);

  const fetchAuthorsOptions = async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchAuthors(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.username,
    }));
  };

  const fetchEditorOptions = async (filterValue?: string | undefined): Promise<ISelectOption[]> => {
    const data = await apiClient.fetchEditors(filterValue);

    if (!data) {
      return [];
    }

    return map(data, (item) => ({
      value: item.id,
      label: item.username,
    }));
  };

  const currentSearch = history.location.search;

  useEffect(() => {
    const newSearch = buildSearchString(status, page, perPage, author, editor, text, categoryFilter, startDate, endDate, templateAvailable, startDatePR, endDatePR);

    if (currentSearch !== newSearch) {
      history.replace({
        pathname: '/',
        search: newSearch,
      });
    }
  }, [ status, page, perPage, currentSearch, author, history, editor, text, categoryFilter, startDate, endDate, templateAvailable, startDatePR, endDatePR ]);

  const [ cookies ] = useCookies([ 'user' ]);

  const canTakeAnyStory = cookies?.user?.canTakeAnyStory || false;

  const buildSWRKey = () => {
    const args = {
      status,
      page,
      perPage,
      author,
      editor,
      text,
      categoryFilter,
      templateAvailable,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
      startDatePR: startDatePR ? startDatePR.format('YYYY-MM-DD') : null,
      endDatePR: endDatePR ? endDatePR.format('YYYY-MM-DD') : null,
    };

    return qs.stringify(args);
  };

  const storyCategoriesGroupsRequestOptions = async (): Promise<ICascaderOption[]> => {
    const data = await apiClient.fetchStoryCategoriesGroups();

    if (!data) {
      return [];
    }

    const result = [ {
      value: '__EMPTY__',
      label: 'Empty category',
    } ];

    const values = map(data, (item) => ({
      value: item.title,
      label: item.title,
      children: map(item.story_categories_sub_groups, y => ({
        value: y.title,
        label: y.title,
        children: map(y.story_categories, x => ({
          value: x.title,
          label: x.title,
        })),
      })),
    }));

    return [
      ...result,
      ...values,
    ];
  };

  const { data, error } = useSWR(`stories/${buildSWRKey()}`, async () => {
    const filter: IFilter[] = [];

    if (status) {
      filter.push({
        field: 'status',
        value: status.value,
      });
    }

    if (status && status.value === StoryStatus.TEMPLATE) {
      filter.push({
        field: 'available',
        value: String(templateAvailable),
      });
    }

    if (startDate) {
      filter.push({
        field: 'createdAt_gte',
        value: `${startDate.format('YYYY-MM-DD')}T00:00:00.000Z`,
      });
    }

    if (endDate) {
      filter.push({
        field: 'createdAt_lte',
        value: `${endDate.format('YYYY-MM-DD')}T23:59:59.000Z`,
      });
    }

    if (startDatePR) {
      filter.push({
        field: 'proofreadingFinishDate_gte',
        value: `${startDatePR.format('YYYY-MM-DD')}T00:00:00.000Z`,
      });
    }

    if (endDatePR) {
      filter.push({
        field: 'proofreadingFinishDate_lte',
        value: `${endDatePR.format('YYYY-MM-DD')}T23:59:59.000Z`,
      });
    }

    if (author) {
      filter.push({
        field: 'author',
        value: author.value,
      });
    }

    if (editor) {
      filter.push({
        field: 'editor',
        value: editor.value,
      });
    }

    const args = {
      filter,
      limit: perPage,
      start: (page - 1) * perPage,
      storyTextContain: text,
      category: categoryFilter,
    };

    if (role === ADMIN) {
      const [ stories, total, payInProgressStatusChangeBlocked, storyCategories ] = await Promise.all([
        apiClient.fetchStories(args),
        apiClient.countStories(args),
        apiClient.fetchPayInProgressStatusChangeBlocked(),
        storyCategoriesGroupsRequestOptions(),
      ]);

      return {
        stories,
        total,
        payInProgressStatusChangeBlocked,
        storyCategories,
      };
    } else {
      const [ stories, total, storyCategories ] = await Promise.all([
        apiClient.fetchStories(args),
        apiClient.countStories(args),
        storyCategoriesGroupsRequestOptions(),
      ]);

      return {
        stories,
        total,
        payInProgressStatusChangeBlocked: true,
        storyCategories,
      };
    }
  });

  const { mutate } = useSWRConfig();

  const refetch = () => {
    mutate(`stories/${buildSWRKey()}`);
  };

  const isLoading = !error && !data;

  const onPaginationChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) {
      setPerPage(pageSize);
    }
  };

  const onChangeStatusFilter = (newValue: any) => {
    setStatus(newValue);
    setPage(1);
  };

  const onChangeAuthorFilter = (newValue: any) => {
    setAuthor(newValue);
    setPage(1);
  };

  const onChangeEditorFilter = (newValue: any) => {
    setEditor(newValue);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [ templateAvailable ]);

  const [ selectedStories, setSelectedStories ] = useState<string[]>([]);

  useEffect(() => {
    setSelectedStories([]);
  }, [ status, categoryFilter, author, editor, startDate, endDate, templateAvailable ]);

  useEffect(() => {
    if (data && data.payInProgressStatusChangeBlocked) {
      setSelectedStories([]);
    }
  }, [ data ]);

  const role = cookies.user?.role?.name || GUEST;

  const indeterminate = Boolean(data?.stories?.length && selectedStories.length > 0 && selectedStories.length < data.stories.length);
  const allSelected = Boolean(data?.stories?.length && selectedStories.length > 0 && selectedStories.length === data.stories.length);

  const getIsStatusForAsignEditor = (status: StoryStatus) => {
    return status === StoryStatus.WAIT_FOR_APPROVE
      || status === StoryStatus.WAIT_PROOFREADING_OF_PAID
      || status === StoryStatus.IN_PROOFREADING_OF_PAID
      || status === StoryStatus.PROOFREADING_OF_PAID_DONE;
  };

  const isStatusForAsignEditor = (!!status && getIsStatusForAsignEditor(status.value));

  const isTemplateBulk = Boolean(data?.stories?.length && !!status && status.value === StoryStatus.TEMPLATE);

  const withBulk = role === ADMIN
    && (
      isTemplateBulk
      || (
        Boolean(data?.stories?.length && !!status && getStatusesForBulkAction(status.value, data.payInProgressStatusChangeBlocked)?.length)
        || isStatusForAsignEditor
      )
    );

  const onBulkActionClick = (toStatus: StoryStatus) => async () => {
    await apiClient.storiesBulkStatusChange(selectedStories, toStatus);
    refetch();
    setSelectedStories([]);
    message.success(`Status of ${selectedStories.length} ${selectedStories.length === 1 ? 'story' : 'stories'} was changed to ${toStatus}`);
  };

  const onBulkTemplateAvailable = async () => {
    await apiClient.bulkTemplatesAvailableChange(selectedStories, !templateAvailable);
    refetch();
    setSelectedStories([]);
    message.success(`Available of ${selectedStories.length} ${selectedStories.length === 1 ? 'template' : 'templates'} was changed to ${String(!templateAvailable)}`);
  }

  const onPayInProgressStatusChangeBlockedChange = async (value: boolean) => {
    await apiClient.updatePayInProgressStatusChangeBlocked(value);
    refetch();
  };

  if (error) {
    console.error(error);
  }

  // eslint-disable-next-line
  const debouncedTextChange = useCallback(debounce((text: string) => {
    setText(text);
    setPage(1);
  }, 250, { 'maxWait': 1000 }), [setText, setPage]);

  useEffect(() => {
    if (inputTextValue !== text) {
      debouncedTextChange(inputTextValue);
    }
  }, [ inputTextValue, debouncedTextChange, text ]);

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputTextValue(value);
  };

  const onCascaderPopupVisibleChange = (visible: boolean) => {
    setCategoryPopupVisible(visible);
  };

  const onChangeCategory = (value: any) => {
    setCategory(value);
  };

  return (
    <div className="StoryList">
      {error && (
        <div className="StoryList__Error">
          Failed to load<br/><br/>
          <Button onClick={refetch}>Try load again</Button>
        </div>
      )}
      <div className="StoryList__table">
        <div className="StoryList__filters">
          <div className="filter-select-wrapper">
            <div className="filterLabel">Text in story</div>
            <Input
              size="large"
              placeholder="Search by text in story"
              prefix={<SearchOutlined/>}
              value={inputTextValue}
              onChange={onSearchInputChange}
            />
          </div>
          <div className="filter-select-wrapper">
            <div className="filterLabel">Status</div>
            <Select
              isClearable={true}
              placeholder="Select status"
              onChange={onChangeStatusFilter}
              value={status}
              options={getStatusOptions(role)}
              formatOptionLabel={formatStatusOptionLabel}
            />
          </div>

          {(role === ADMIN || role === EDITOR) && (
            <div className="filter-select-wrapper">
              <div className="filterLabel">Category</div>
              <Cascader
                showSearch={true}
                onPopupVisibleChange={onCascaderPopupVisibleChange}
                placeholder="Select category"
                onChange={onChangeCategory}
                changeOnSelect={true}
                value={category}
                disabled={!data}
                options={data ? data.storyCategories : []}
              />
            </div>
          )}

          <div className="filter-select-wrapper">
            <div className="filterLabel">Date of creation</div>
            <DatePicker.RangePicker
              size="large"
              value={[ startDate, endDate ]}
              disabledDate={disabledDate}
              onChange={onChangeRange}
            />
          </div>

          {(role === ADMIN || role === EDITOR) && (
            <div className="filter-select-wrapper">
              <div className="filterLabel">Author</div>
              <AsyncSelect
                isClearable={true}
                cacheOptions={true}
                defaultOptions={true}
                placeholder="Select author"
                loadOptions={fetchAuthorsOptions}
                onChange={onChangeAuthorFilter}
                value={author}
              />
            </div>
          )}

          {data && role === ADMIN && status && status.value === StoryStatus.TEMPLATE && (
            <div className="block-switcher">
              <label>
                Template available
                <Switch
                  defaultChecked={templateAvailable}
                  onChange={setTemplateAvailable}
                />
              </label>
            </div>
          )}
        </div>
        <div className="StoryList__filters">
          <div className="filter-select-wrapper">
            <div className="filterLabel">Date of proofreading</div>
            <DatePicker.RangePicker
              size="large"
              value={[ startDatePR, endDatePR ]}
              disabledDate={disabledDate}
              onChange={onChangeRangePR}
            />
          </div>

          {(role === ADMIN || (role === EDITOR && canTakeAnyStory)) && (
            <div className="filter-select-wrapper">
              <div className="filterLabel">Editor</div>
              <AsyncSelect
                isClearable={true}
                cacheOptions={true}
                defaultOptions={true}
                placeholder="Select editor"
                loadOptions={fetchEditorOptions}
                onChange={onChangeEditorFilter}
                value={editor}
              />
            </div>
          )}
        </div>
        {role === ADMIN && (
          <div className="admin-excel-actions">
            <AntButton
              type="primary"
              icon={<FileExcelFilled/>}
              onClick={async () => {
                const records = await apiClient.fetchPaymentExcelData();
                const jsonAuthors = map(records.authors, record => {
                  return {
                    name: record.author,
                    count: record.count,
                    creditCardNumber: record.creditCardNumber,
                    creditCardOwnerName: record.creditCardOwnerName,
                    paypall: record.paypall,
                  };
                });

                const jsonEditors = map(records.editors, record => {
                  return {
                    name: record.editor,
                    count: record.count,
                    creditCardNumber: record.creditCardNumber,
                    creditCardOwnerName: record.creditCardOwnerName,
                    paypall: record.paypall,
                  };
                });

                const json = [
                  {
                    name: 'Authors',
                    count: '',
                    creditCardNumber: '',
                    creditCardOwnerName: '',
                    paypall: '',
                  },
                  ...jsonAuthors,
                  {
                    name: 'Editors',
                    count: '',
                    creditCardNumber: '',
                    creditCardOwnerName: '',
                    paypall: '',
                  },
                  ...jsonEditors,
                ];

                json2csv(json, (error, csv) => {
                  if (!error && csv) {
                    var exportedFilenmae = `${dateAndTime.format(new Date(), 'DD.MM.YYYY_HH-mm-ss')}-export.csv`;

                    var blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });
                    // @ts-ignore
                    if (navigator.msSaveBlob) { // IE 10+
                      // @ts-ignore
                      navigator.msSaveBlob(blob, exportedFilenmae);
                    } else {
                      const link = document.createElement('a');
                      if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', exportedFilenmae);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }
                  }
                });
              }}
            >
              Download payment in progress
            </AntButton>
            {data && role === ADMIN && (
              <div className="block-switcher">
                <label>
                  {StoryStatus.PAYMENT_IN_PROGRESS} blocked
                  <Switch
                    defaultChecked={data.payInProgressStatusChangeBlocked}
                    onChange={onPayInProgressStatusChangeBlockedChange}
                    checkedChildren={<LockOutlined/>}
                  />
                </label>
              </div>
            )}
          </div>
        )}
        {isLoading && (
          <div className="Loading">
            <ClipLoader
              color="#00AFB9"
              size={40}
            />
            {'\u00A0'}
            Loading...
          </div>
        )}

        {data && data.stories.length > 0 && (
          <React.Fragment>
            {data.total > 0 && (
              <div className="top-pagination">
                <Pagination
                  defaultCurrent={page}
                  total={data.total}
                  pageSize={perPage}
                  pageSizeOptions={pageSizeOptions}
                  onChange={onPaginationChange}
                  showTotal={showTotal}
                  showSizeChanger={true}
                />
              </div>
            )}
            <StoryListItemHeader
              withBulk={withBulk}
              allSelected={allSelected}
              indeterminate={indeterminate}
              onCheckboxClick={() => {
                if (allSelected) {
                  setSelectedStories([]);
                  return;
                }

                setSelectedStories(map(data.stories, (story) => story.id));
              }}
            />
            {status && selectedStories.length > 0 && (
              <div className="StoryList__bulk_row">
                <div className="StoryList__bulk_text">
                  {`${selectedStories.length} ${selectedStories.length === 1 ? 'story' : 'stories'} selected`} &mdash;
                </div>
                <div className="StoryList__bulk_actions">
                  {getIsStatusForAsignEditor(status.value) && (
                    <div className="editor-appoint">
                      <div className="label">Appoint an editor</div>
                      <div className="editor-appoint-select-root">
                        <AsyncSelect
                          isClearable={true}
                          cacheOptions={true}
                          defaultOptions={true}
                          placeholder="Select editor"
                          loadOptions={fetchEditorOptions}
                          onChange={async (newValue) => {
                            if (newValue) {
                              // eslint-disable-next-line no-restricted-globals
                              if (confirm(`Appoint ${selectedStories.length} selected to editor ${newValue.label}`)) {
                                await apiClient.appointStories(selectedStories, String(newValue.value));
                                setSelectedStories([]);
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {map(getStatusesForBulkAction(status.value, data.payInProgressStatusChangeBlocked), (statusToBulk) => {
                    return (
                      <Popconfirm
                        key={statusToBulk}
                        title={`Are you sure you want to change the status of ${selectedStories.length} ${selectedStories.length === 1 ? 'story' : 'stories'} to ${statusToBulk}`}
                        onConfirm={onBulkActionClick(statusToBulk)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <div className="StoryList__bulk_action">
                          {statusToBulk}
                        </div>
                      </Popconfirm>
                    );
                  })}
                  {isTemplateBulk && (
                    <Popconfirm
                      title={`Are you sure you want to change the available of ${selectedStories.length} ${selectedStories.length === 1 ? 'template' : 'templates'} to ${String(!templateAvailable)}`}
                      onConfirm={onBulkTemplateAvailable}
                      okText="Yes"
                      cancelText="No"
                    >
                      <div className="StoryList__bulk_action">
                        {`Change template available to ${String(!templateAvailable)}`}
                      </div>
                    </Popconfirm>
                  )}
                </div>
              </div>
            )}
            {map(data.stories, (story) => (
              <StoryListItem
                selected={selectedStories.includes(story.id)}
                onCheckboxClick={(event) => {
                  const selected = selectedStories.includes(story.id);

                  if (selected) {
                    setSelectedStories(filter(selectedStories, storyId => storyId !== story.id));
                  } else {
                    setSelectedStories([ ...selectedStories, story.id ]);
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }}
                withBulk={withBulk}
                key={story.id}
                story={story}
              />
            ))}
            {data.total > 0 && (
              <Pagination
                defaultCurrent={page}
                total={data.total}
                pageSize={perPage}
                pageSizeOptions={pageSizeOptions}
                onChange={onPaginationChange}
                showTotal={showTotal}
                showSizeChanger={true}
              />
            )}
          </React.Fragment>
        )}
        {data && data.stories.length === 0 && (
          <div className="StoryList__noStories">No stories</div>
        )}
      </div>
    </div>
  );
};

interface IBulkStatuses {
  [key: string]: StoryStatus[];
}

const bulkStatuses: IBulkStatuses = {
  [StoryStatus.APPROVED]: [
    StoryStatus.PAYMENT_IN_PROGRESS,
  ],
  [StoryStatus.PAYMENT_IN_PROGRESS]: [
    StoryStatus.PAID,
    StoryStatus.PAYMENT_ERROR,
  ],
  [StoryStatus.PAYMENT_ERROR]: [
    StoryStatus.PAID,
  ],
  [StoryStatus.REJECTED]: [
    StoryStatus.TRASH,
  ],
  [StoryStatus.PAID]: [
    StoryStatus.WAIT_PROOFREADING_OF_PAID,
    StoryStatus.TO_BUILD,
  ],
  [StoryStatus.WAIT_PROOFREADING_OF_PAID]: [
    StoryStatus.IN_PROOFREADING_OF_PAID,
    StoryStatus.TRASH,
    StoryStatus.FOR_DELETION,
  ],
  [StoryStatus.IN_PROOFREADING_OF_PAID]: [
    StoryStatus.PROOFREADING_OF_PAID_DONE,
    StoryStatus.TRASH,
  ],
  [StoryStatus.PROOFREADING_OF_PAID_DONE]: [
    StoryStatus.TO_BUILD,
    StoryStatus.TRASH,
  ],
  [StoryStatus.TO_BUILD]: [
    StoryStatus.IN_BUILD,
    StoryStatus.TRASH,
  ],
  [StoryStatus.IN_BUILD]: [
    StoryStatus.TRASH,
  ],
  [StoryStatus.FOR_DELETION]: [
    StoryStatus.WAIT_PROOFREADING_OF_PAID,
    StoryStatus.TRASH,
  ],
  [StoryStatus.TRASH]: [
    StoryStatus.WAIT_PROOFREADING_OF_PAID,
    StoryStatus.FOR_DELETION,
  ],
};


const getStatusesForBulkAction = (status: StoryStatus, payInProgressStatusChangeBlocked: boolean) => {
  const statuses = bulkStatuses[status];
  if (payInProgressStatusChangeBlocked) {
    return filter(statuses, (status) => status !== StoryStatus.PAYMENT_IN_PROGRESS);
  }

  return statuses;
};

export default StoryList;
