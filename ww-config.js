export default {
  editor: {
    label: 'Folder Card List',
    icon: 'view-list',
  },

  properties: {
    data: {
      label: { en: 'Folder Data' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          id: 1,
          created_at: 1700000000000,
          tenant_id: 1,
          name: 'Marketing Assets',
          has_public_portal: true,
          read_content_mode: 'Enabled',
          total_size_bytes: 5242880,
          file_count: 24,
          dropbox_path_display: '/Marketing Assets',
          dropbox_path_lower: '/marketing assets',
          dropbox_folder_id: 'id:abc123',
        },
        {
          id: 2,
          created_at: 1700000000000,
          tenant_id: 1,
          name: 'Legal Documents',
          has_public_portal: false,
          read_content_mode: 'Metadata',
          total_size_bytes: 10485760,
          file_count: 87,
          dropbox_path_display: '/Legal Documents',
          dropbox_path_lower: '/legal documents',
          dropbox_folder_id: 'id:def456',
        },
        {
          id: 3,
          created_at: 1700000000000,
          tenant_id: 1,
          name: 'Archive 2023',
          has_public_portal: false,
          read_content_mode: 'Disabled',
          total_size_bytes: 2097152,
          file_count: 11,
          dropbox_path_display: '/Archive 2023',
          dropbox_path_lower: '/archive 2023',
          dropbox_folder_id: 'id:ghi789',
        },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.name || `Folder ${item.id || 'Unknown'}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            id: 1,
            created_at: 1700000000000,
            tenant_id: 1,
            name: 'New Folder',
            has_public_portal: false,
            read_content_mode: 'Disabled',
            total_size_bytes: 0,
            file_count: 0,
            dropbox_path_display: '',
            dropbox_path_lower: '',
            dropbox_folder_id: '',
          },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Number' },
              created_at: { label: { en: 'Created At' }, type: 'Number' },
              tenant_id: { label: { en: 'Tenant ID' }, type: 'Number' },
              name: { label: { en: 'Folder Name' }, type: 'Text' },
              has_public_portal: { label: { en: 'Has Public Portal' }, type: 'OnOff' },
              read_content_mode: { label: { en: 'Read Content Mode' }, type: 'Text' },
              total_size_bytes: { label: { en: 'Total Size (Bytes)' }, type: 'Number' },
              file_count: { label: { en: 'File Count' }, type: 'Number' },
              dropbox_path_display: { label: { en: 'Dropbox Path Display' }, type: 'Text' },
              dropbox_path_lower: { label: { en: 'Dropbox Path Lower' }, type: 'Text' },
              dropbox_folder_id: { label: { en: 'Dropbox Folder ID' }, type: 'Text' },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of folder objects from Xano.',
      },
      /* wwEditor:end */
    },

    dataIdFormula: {
      label: { en: 'ID Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['id']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataNameFormula: {
      label: { en: 'Name Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['name']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataFileCountFormula: {
      label: { en: 'File Count Field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['file_count']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataReadContentModeFormula: {
      label: { en: 'AI Policy Field (read_content_mode)' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['read_content_mode']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    dataHasPublicPortalFormula: {
      label: { en: 'Public Portal Field (has_public_portal)' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.data) && content.data.length > 0 ? content.data[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['has_public_portal']" },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.data) || !content.data?.length || !boundProps.data,
    },

    primaryColor: {
      label: { en: 'Primary Color (Open Button)' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2d6a4f',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CSS color value for the Open button background' },
      /* wwEditor:end */
    },

    outlineColor: {
      label: { en: 'Outline Color (Edit Button)' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2d6a4f',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'CSS color value for the Edit button border and text' },
      /* wwEditor:end */
    },

    cardBackground: {
      label: { en: 'Card Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Background color of each card' },
      /* wwEditor:end */
    },

    cardBorderColor: {
      label: { en: 'Card Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e5e7eb',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Border color of each card' },
      /* wwEditor:end */
    },

    cardBorderRadius: {
      label: { en: 'Card Border Radius (px)' },
      type: 'Number',
      section: 'style',
      min: 0,
      max: 32,
      step: 1,
      defaultValue: 8,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Border radius in pixels (0-32)' },
      /* wwEditor:end */
    },

    labelTextColor: {
      label: { en: 'Label Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#6b7280',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Color for field labels' },
      /* wwEditor:end */
    },

    valueTextColor: {
      label: { en: 'Value Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#111827',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Color for field values' },
      /* wwEditor:end */
    },

    folderNameColor: {
      label: { en: 'Folder Name Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2d6a4f',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Color of the clickable folder name' },
      /* wwEditor:end */
    },

    cardGap: {
      label: { en: 'Card Gap (px)' },
      type: 'Number',
      section: 'style',
      min: 0,
      max: 64,
      step: 1,
      defaultValue: 12,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Vertical gap between cards in pixels' },
      /* wwEditor:end */
    },

    fontSize: {
      label: { en: 'Font Size (px)' },
      type: 'Number',
      section: 'style',
      min: 10,
      max: 24,
      step: 1,
      defaultValue: 14,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'number', tooltip: 'Base font size in pixels (10-24)' },
      /* wwEditor:end */
    },
  },

  triggerEvents: [
    {
      name: 'open-click',
      label: { en: 'On Open click' },
      event: { folder: null },
    },
    {
      name: 'edit-click',
      label: { en: 'On Edit click' },
      event: { folder: null },
    },
    {
      name: 'name-click',
      label: { en: 'On folder name click' },
      event: { folder: null },
    },
    {
      name: 'share-link-click',
      label: { en: 'On View Only Link click' },
      event: { folder: null },
    },
  ],
};
