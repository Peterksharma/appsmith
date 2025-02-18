package com.appsmith.server.solutions;

import com.appsmith.server.newaction.base.NewActionService;
import com.appsmith.server.repositories.ActionCollectionRepository;
import com.appsmith.server.repositories.DatasourceRepository;
import com.appsmith.server.repositories.NewActionRepository;
import com.appsmith.server.repositories.NewPageRepository;
import com.appsmith.server.repositories.PermissionGroupRepository;
import com.appsmith.server.repositories.PluginRepository;
import com.appsmith.server.services.ActionCollectionService;
import com.appsmith.server.services.AnalyticsService;
import com.appsmith.server.services.ApplicationPageService;
import com.appsmith.server.services.ApplicationService;
import com.appsmith.server.services.CustomJSLibService;
import com.appsmith.server.services.DatasourceService;
import com.appsmith.server.services.DatasourceStorageService;
import com.appsmith.server.services.NewPageService;
import com.appsmith.server.services.SequenceService;
import com.appsmith.server.services.SessionUserService;
import com.appsmith.server.services.ThemeService;
import com.appsmith.server.services.WorkspaceService;
import com.appsmith.server.solutions.ce.ImportExportApplicationServiceCEImpl;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.transaction.reactive.TransactionalOperator;

@Slf4j
@Component
@Primary
public class ImportExportApplicationServiceImpl extends ImportExportApplicationServiceCEImpl
        implements ImportExportApplicationService {

    public ImportExportApplicationServiceImpl(
            DatasourceService datasourceService,
            SessionUserService sessionUserService,
            NewActionRepository newActionRepository,
            DatasourceRepository datasourceRepository,
            PluginRepository pluginRepository,
            WorkspaceService workspaceService,
            ApplicationService applicationService,
            NewPageService newPageService,
            ApplicationPageService applicationPageService,
            NewPageRepository newPageRepository,
            NewActionService newActionService,
            SequenceService sequenceService,
            ActionCollectionRepository actionCollectionRepository,
            ActionCollectionService actionCollectionService,
            ThemeService themeService,
            AnalyticsService analyticsService,
            CustomJSLibService customJSLibService,
            DatasourcePermission datasourcePermission,
            WorkspacePermission workspacePermission,
            ApplicationPermission applicationPermission,
            PagePermission pagePermission,
            ActionPermission actionPermission,
            Gson gson,
            TransactionalOperator transactionalOperator,
            DatasourceStorageService datasourceStorageService,
            PermissionGroupRepository permissionGroupRepository) {

        super(
                datasourceService,
                sessionUserService,
                newActionRepository,
                datasourceRepository,
                pluginRepository,
                workspaceService,
                applicationService,
                newPageService,
                applicationPageService,
                newPageRepository,
                newActionService,
                sequenceService,
                actionCollectionRepository,
                actionCollectionService,
                themeService,
                analyticsService,
                customJSLibService,
                datasourcePermission,
                workspacePermission,
                applicationPermission,
                pagePermission,
                actionPermission,
                gson,
                transactionalOperator,
                datasourceStorageService,
                permissionGroupRepository);
    }
}
