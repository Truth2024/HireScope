import toast from 'react-hot-toast';

import { ToasterCandidate, ToasterHR } from '@components';
import type { Notification } from '@myTypes/notification';

export const showNotificationToast = (data: Notification) => {
  switch (data.type) {
    case 'new_candidate':
      toast.custom((t) => (
        <ToasterHR
          id={t.id}
          candidateId={data.candidateId!}
          firstName={data.firstName}
          secondName={data.secondName}
          avatar={data.avatar}
          matchScore={data.matchScore}
        />
      ));
      break;

    case 'candidate-accepted':
      toast.custom((t) => (
        <ToasterCandidate
          id={t.id}
          type="accepted"
          vacancyId={data.vacancyId!}
          title={data.title!}
          company={data.company!}
          message={data.message || 'Работодатель принял вашу кандидатуру'}
        />
      ));
      break;

    case 'candidate-rejected':
      toast.custom((t) => (
        <ToasterCandidate
          id={t.id}
          type="rejected"
          vacancyId={data.vacancyId!}
          title={data.title!}
          company={data.company!}
          message={data.message || 'Работодатель отклонил вашу кандидатуру'}
        />
      ));
      break;
  }
};
