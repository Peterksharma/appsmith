import React, { useCallback, useContext } from "react";
import {
  useAppWideAndOtherDatasource,
  useDatasourceSuggestions,
} from "./hooks";
import type { Datasource } from "entities/Datasource";
import ExplorerDatasourceEntity from "./Datasources/DatasourceEntity";
import { useSelector } from "react-redux";
import {
  getCurrentApplicationId,
  getCurrentPageId,
} from "selectors/editorSelectors";
import { getPlugins } from "@appsmith/selectors/entitiesSelector";
import { keyBy } from "lodash";
import Entity from "./Entity";
import history from "utils/history";
import { INTEGRATION_TABS } from "constants/routes";
import {
  ADD_DATASOURCE_BUTTON,
  createMessage,
  CREATE_DATASOURCE_TOOLTIP,
  EMPTY_DATASOURCE_BUTTON_TEXT,
  EMPTY_DATASOURCE_MAIN_TEXT,
} from "@appsmith/constants/messages";
import styled from "styled-components";
import {
  useDatasourceIdFromURL,
  getExplorerStatus,
  saveExplorerStatus,
} from "@appsmith/pages/Editor/Explorer/helpers";
import { Icon, Button } from "design-system";
import { AddEntity, EmptyComponent } from "./common";
import { integrationEditorURL } from "RouteBuilder";
import { getCurrentAppWorkspace } from "@appsmith/selectors/workspaceSelectors";

import type { AppState } from "@appsmith/reducers";
import {
  hasCreateDatasourcePermission,
  hasManageDatasourcePermission,
} from "@appsmith/utils/permissionHelpers";
import { DatasourceCreateEntryPoints } from "constants/Datasource";
import AnalyticsUtil from "utils/AnalyticsUtil";
import WalkthroughContext from "components/featureWalkthrough/walkthroughContext";

const ShowAllButton = styled(Button)`
  margin: 0.25rem 1.5rem;
`;

const Datasources = React.memo(() => {
  const { appWideDS, otherDS } = useAppWideAndOtherDatasource();
  const pageId = useSelector(getCurrentPageId) || "";
  const plugins = useSelector(getPlugins);
  const applicationId = useSelector(getCurrentApplicationId);
  const isDatasourcesOpen = getExplorerStatus(applicationId, "datasource");
  const pluginGroups = React.useMemo(() => keyBy(plugins, "id"), [plugins]);
  const { isOpened: isWalkthroughOpened, popFeature } =
    useContext(WalkthroughContext) || {};

  const userWorkspacePermissions = useSelector(
    (state: AppState) => getCurrentAppWorkspace(state).userPermissions ?? [],
  );

  const canCreateDatasource = hasCreateDatasourcePermission(
    userWorkspacePermissions,
  );

  const closeWalkthrough = useCallback(() => {
    if (isWalkthroughOpened && popFeature) {
      popFeature("EXPLORER_DATASOURCE_ADD");
    }
  }, [isWalkthroughOpened, popFeature]);

  const addDatasource = (entryPoint: string) => {
    history.push(
      integrationEditorURL({
        pageId,
        selectedTab: INTEGRATION_TABS.NEW,
      }),
    );
    // Event for datasource creation click
    AnalyticsUtil.logEvent("NAVIGATE_TO_CREATE_NEW_DATASOURCE_PAGE", {
      entryPoint,
    });
    closeWalkthrough();
  };
  const activeDatasourceId = useDatasourceIdFromURL();
  const datasourceSuggestions = useDatasourceSuggestions();

  const listDatasource = useCallback(() => {
    history.push(
      integrationEditorURL({
        pageId,
        selectedTab: INTEGRATION_TABS.ACTIVE,
      }),
    );
  }, [pageId]);

  const datasourceElements = React.useMemo(
    () =>
      appWideDS.concat(datasourceSuggestions).map((datasource: Datasource) => {
        const datasourcePermissions = datasource.userPermissions || [];

        const canManageDatasource = hasManageDatasourcePermission(
          datasourcePermissions,
        );
        return (
          <ExplorerDatasourceEntity
            canManageDatasource={canManageDatasource}
            datasource={datasource}
            isActive={datasource.id === activeDatasourceId}
            key={datasource.id}
            pageId={pageId}
            plugin={pluginGroups[datasource.pluginId]}
            searchKeyword={""}
            step={1}
          />
        );
      }),
    [appWideDS, pageId, activeDatasourceId],
  );

  const onDatasourcesToggle = useCallback(
    (isOpen: boolean) => {
      saveExplorerStatus(applicationId, "datasource", isOpen);
    },
    [applicationId],
  );

  return (
    <Entity
      addButtonHelptext={createMessage(CREATE_DATASOURCE_TOOLTIP)}
      className={"group datasources"}
      entityId={"datasources"}
      icon={null}
      isDefaultExpanded={
        isDatasourcesOpen === null || isDatasourcesOpen === undefined
          ? true
          : isDatasourcesOpen
      }
      isSticky
      name="Datasources"
      onCreate={() =>
        addDatasource(DatasourceCreateEntryPoints.ENTITY_EXPLORER_ADD_DS)
      }
      onToggle={onDatasourcesToggle}
      searchKeyword={""}
      showAddButton={canCreateDatasource}
      step={0}
    >
      {datasourceElements.length ? (
        datasourceElements
      ) : (
        <EmptyComponent
          mainText={createMessage(EMPTY_DATASOURCE_MAIN_TEXT)}
          {...(canCreateDatasource && {
            addBtnText: createMessage(EMPTY_DATASOURCE_BUTTON_TEXT),
            addFunction: () =>
              addDatasource(
                DatasourceCreateEntryPoints.ENTITY_EXPLORER_NEW_DATASOURCE,
              ),
          })}
        />
      )}
      {datasourceElements.length > 0 && canCreateDatasource && (
        <AddEntity
          action={() =>
            addDatasource(
              DatasourceCreateEntryPoints.ENTITY_EXPLORER_ADD_DS_CTA,
            )
          }
          entityId="add_new_datasource"
          icon={<Icon name="plus" />}
          name={createMessage(ADD_DATASOURCE_BUTTON)}
          step={1}
        />
      )}
      {otherDS.length ? (
        <ShowAllButton
          endIcon="arrow-right-line"
          kind="tertiary"
          onClick={listDatasource}
          size="sm"
        >
          Show all datasources
        </ShowAllButton>
      ) : null}
    </Entity>
  );
});

Datasources.displayName = "Datasources";

export default Datasources;
