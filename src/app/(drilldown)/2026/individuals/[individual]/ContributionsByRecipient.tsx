import { fetchAllRecipients, fetchIndividual, fetchNonCandidateCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import individualStyles from "@/app/components/individualOrCompany/individualOrCompany.module.css";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualContributions } from "@/app/types/Individuals";
import { is4xx, isError } from "@/app/utils/errors";

export default async function ContributionsByRecipient({
  individual,
}: {
  individual: string;
}) {
  const [individualData, recipientsData, nonCandidateCommittees] = await Promise.all([
    fetchIndividual(individual),
    fetchAllRecipients(),
    fetchNonCandidateCommittees(),
  ]);
  if (isError(individualData) && !is4xx(individualData)) {
    return (
      <div className={`secondary ${individualStyles.contributionRow}`}>
        <ErrorText subject="individual contributions" />
      </div>
    );
  } else if (
    is4xx(individualData) ||
    !(individualData as IndividualContributions).contributions.length
  ) {
    return (
      <div className={`secondary ${individualStyles.contributionRow}`}>
        No contributions yet.
      </div>
    );
  }
  const contributions = (individualData as IndividualContributions)
    .contributions;
  const recipients = isError(recipientsData)
    ? {}
    : (recipientsData as Record<string, RecipientDetails>);

  return contributions.map(
    (contributionsGroup: IndividualOrCompanyContributionGroup, ind: number) => {
      return (
        <ContributionsGroup
          key={`contrib-group-${ind}`}
          contributionsGroup={contributionsGroup}
          recipient={recipients[contributionsGroup.committee_id]}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      );
    },
  );
}
