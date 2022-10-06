import { StoryStatus } from '../Api/ApiClient';

export enum StoryStatusColor {
  DRAFT = '#BDBDBD',
  REWRITE_REQUIRED = '#C800A1',
  REJECTED = '#c8002f',
  APPROVED = '#005FB8',
  WAIT_FOR_APPROVE = '#FFD600',
  PAYMENT_IN_PROGRESS = '#a8e0a9',
  PAID = '#114914'
}

const getStatusColor = (status: string | StoryStatus) => {
  switch (status) {
    case StoryStatus.DRAFT:
      return StoryStatusColor.DRAFT;
    case StoryStatus.REWRITE_REQUIRED:
      return StoryStatusColor.REWRITE_REQUIRED;
    case StoryStatus.APPROVED:
      return StoryStatusColor.APPROVED;
    case StoryStatus.WAIT_FOR_APPROVE:
      return StoryStatusColor.WAIT_FOR_APPROVE;
    case StoryStatus.REJECTED:
      return StoryStatusColor.REJECTED;
    case StoryStatus.PAYMENT_IN_PROGRESS:
      return StoryStatusColor.PAYMENT_IN_PROGRESS;
    case StoryStatus.PAID:
      return StoryStatusColor.PAID;
    default:
      return StoryStatusColor.DRAFT;
  }
}

export default getStatusColor;
