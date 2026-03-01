<template>
  <div class="folder-card-list" :style="containerStyle">

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-search-wrap">
        <span class="filter-search-icon">🔍</span>
        <input
          class="filter-input"
          type="text"
          placeholder="Folder Name"
          :value="searchQuery"
          @input="handleSearchInput"
        />
      </div>
      <select class="filter-select" :value="portalFilter" @change="handlePortalChange">
        <option value="all">All</option>
        <option value="active">Active Public Page</option>
        <option value="inactive">No Public Page</option>
      </select>
      <button class="filter-reset" type="button" @click="handleReset">Reset</button>
    </div>

    <!-- Cards -->
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="folder-card"
      :style="cardStyle"
    >
      <!-- Action Row -->
      <div class="card-actions">
        <button
          class="btn-action btn-open"
          :style="getOpenButtonStyle(item.id)"
          type="button"
          @click="handleOpen(item)"
          @mouseenter="setHover(item.id, 'open', true)"
          @mouseleave="setHover(item.id, 'open', false)"
          @mousedown="setActive(item.id, 'open', true)"
          @mouseup="setActive(item.id, 'open', false)"
        >
          Open
        </button>
        <button
          class="btn-action btn-edit"
          :style="getEditButtonStyle(item.id)"
          type="button"
          @click="handleEdit(item)"
          @mouseenter="setHover(item.id, 'edit', true)"
          @mouseleave="setHover(item.id, 'edit', false)"
          @mousedown="setActive(item.id, 'edit', true)"
          @mouseup="setActive(item.id, 'edit', false)"
        >
          Edit
        </button>
      </div>

      <!-- Folder Name -->
      <div class="card-field folder-name-field">
        <span
          class="folder-name"
          :style="folderNameStyle"
          role="button"
          tabindex="0"
          @click="handleNameClick(item)"
          @keydown.enter="handleNameClick(item)"
          @keydown.space.prevent="handleNameClick(item)"
        >
          {{ item.name }}
        </span>
      </div>

      <!-- Files -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Files</span>
        <span class="field-value" :style="valueStyle">{{ item.file_count || 0 }}</span>
      </div>

      <!-- AI Policy -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">AI Policy</span>
        <span class="field-value ai-policy-value" :style="valueStyle">
          <span v-if="getAiPolicyIcon(item.read_content_mode)" class="ai-policy-icon" aria-hidden="true">{{ getAiPolicyIcon(item.read_content_mode) }}</span>
          {{ getAiPolicyText(item.read_content_mode) }}
        </span>
      </div>

      <!-- Active Public Page -->
      <div class="card-field">
        <span class="field-label" :style="labelStyle">Active Public Page</span>
        <span class="field-value checkbox-value">
          <span
            class="checkbox-box"
            :style="item.has_public_portal ? checkedBoxStyle : uncheckedBoxStyle"
            aria-hidden="true"
          >
            <svg v-if="item.has_public_portal" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!filteredItems.length" class="empty-state" :style="emptyStateStyle">
      No folders to display.
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  name: 'FolderCardList',

  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },

  emits: ['trigger-event'],

  setup(props, { emit }) {
    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    const { value: selectedItem, setValue: setSelectedItem } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'selectedItem',
        type: 'object',
        defaultValue: null,
      });

    const { value: itemCount, setValue: setItemCount } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'itemCount',
        type: 'number',
        defaultValue: 0,
      });

    const { value: filteredCount, setValue: setFilteredCount } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: 'filteredCount',
        type: 'number',
        defaultValue: 0,
      });

    // Filter state
    const searchQuery = ref('');
    const portalFilter = ref('all');

    const hoverState = ref({});
    const activeState = ref({});

    const setHover = (id, btn, val) => {
      hoverState.value = { ...hoverState.value, [id + '-' + btn]: val };
    };

    const setActive = (id, btn, val) => {
      activeState.value = { ...activeState.value, [id + '-' + btn]: val };
    };

    const handleSearchInput = (e) => {
      searchQuery.value = e.target.value;
    };

    const handlePortalChange = (e) => {
      portalFilter.value = e.target.value;
    };

    const handleReset = () => {
      searchQuery.value = '';
      portalFilter.value = 'all';
    };

    const processedItems = computed(() => {
      const items = props.content?.data || [];
      const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

      return items.map((item) => {
        const id = resolveMappingFormula(props.content?.dataIdFormula, item) ?? item?.id;
        const name = resolveMappingFormula(props.content?.dataNameFormula, item) ?? item?.name;
        const file_count = resolveMappingFormula(props.content?.dataFileCountFormula, item) ?? item?.file_count;
        const read_content_mode = resolveMappingFormula(props.content?.dataReadContentModeFormula, item) ?? item?.read_content_mode;
        const has_public_portal = resolveMappingFormula(props.content?.dataHasPublicPortalFormula, item) ?? item?.has_public_portal;

        return {
          ...item,
          id: id || 'item-' + Math.random(),
          name: name || 'Untitled',
          file_count: file_count || 0,
          read_content_mode: read_content_mode || '',
          has_public_portal: Boolean(has_public_portal),
          _original: item,
        };
      });
    });

    const filteredItems = computed(() => {
      let items = processedItems.value;
      const q = (searchQuery.value || '').toLowerCase().trim();
      const p = portalFilter.value;

      if (q) {
        items = items.filter((item) => (item.name || '').toLowerCase().indexOf(q) !== -1);
      }
      if (p === 'active') {
        items = items.filter((item) => item.has_public_portal === true);
      } else if (p === 'inactive') {
        items = items.filter((item) => item.has_public_portal === false);
      }
      return items;
    });

    watch(processedItems, (items) => { setItemCount(items.length || 0); }, { immediate: true });
    watch(filteredItems, (items) => { setFilteredCount(items.length || 0); }, { immediate: true });

    const resolvedPrimaryColor = computed(() => props.content?.primaryColor || '#2d6a4f');
    const resolvedOutlineColor = computed(() => props.content?.outlineColor || '#2d6a4f');

    const darken = (hex, amount) => {
      const h = (hex || '#2d6a4f').replace('#', '');
      const num = parseInt(h.length === 3 ? h.split('').map(function(c) { return c + c; }).join('') : h, 16);
      const r = Math.max(0, (num >> 16) - amount);
      const g = Math.max(0, ((num >> 8) & 0xff) - amount);
      const b = Math.max(0, (num & 0xff) - amount);
      return '#' + [r, g, b].map(function(v) { return v.toString(16).padStart(2, '0'); }).join('');
    };

    const getOpenButtonStyle = (id) => {
      const isActive = activeState.value[id + '-open'];
      const isHovered = hoverState.value[id + '-open'];
      const base = resolvedPrimaryColor.value;
      const bg = isActive ? darken(base, 40) : isHovered ? darken(base, 20) : base;
      return {
        backgroundColor: bg,
        color: '#ffffff',
        borderColor: bg,
        fontSize: (props.content?.fontSize || 14) + 'px',
        boxShadow: isHovered && !isActive ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
        transform: isActive ? 'scale(0.97)' : 'scale(1)',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      };
    };

    const getEditButtonStyle = (id) => {
      const isActive = activeState.value[id + '-edit'];
      const isHovered = hoverState.value[id + '-edit'];
      const base = resolvedOutlineColor.value;
      const darkened = isActive ? darken(base, 40) : isHovered ? darken(base, 20) : base;
      return {
        backgroundColor: isHovered ? (isActive ? darken(base, 40) : darken(base, 20)) : '#ffffff',
        color: isHovered ? '#ffffff' : base,
        borderColor: darkened,
        fontSize: (props.content?.fontSize || 14) + 'px',
        boxShadow: isHovered && !isActive ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
        transform: isActive ? 'scale(0.97)' : 'scale(1)',
        transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      };
    };

    const containerStyle = computed(() => ({
      '--fcl-primary': resolvedPrimaryColor.value,
      '--fcl-outline': resolvedOutlineColor.value,
      '--fcl-card-bg': props.content?.cardBackground || '#ffffff',
      '--fcl-card-border': props.content?.cardBorderColor || '#e5e7eb',
      '--fcl-card-radius': (props.content?.cardBorderRadius || 8) + 'px',
      '--fcl-label-color': props.content?.labelTextColor || '#6b7280',
      '--fcl-value-color': props.content?.valueTextColor || '#111827',
      '--fcl-name-color': props.content?.folderNameColor || '#2d6a4f',
      '--fcl-gap': (props.content?.cardGap || 12) + 'px',
      '--fcl-font-size': (props.content?.fontSize || 14) + 'px',
      display: 'flex',
      flexDirection: 'column',
      gap: (props.content?.cardGap || 12) + 'px',
      width: '100%',
    }));

    const cardStyle = computed(() => ({
      background: props.content?.cardBackground || '#ffffff',
      border: '1px solid ' + (props.content?.cardBorderColor || '#e5e7eb'),
      borderRadius: (props.content?.cardBorderRadius || 8) + 'px',
      fontSize: (props.content?.fontSize || 14) + 'px',
    }));

    const folderNameStyle = computed(() => ({
      color: props.content?.folderNameColor || '#2d6a4f',
      fontSize: (props.content?.fontSize || 14) + 'px',
    }));

    const labelStyle = computed(() => ({
      color: props.content?.labelTextColor || '#6b7280',
      fontSize: (props.content?.fontSize || 14) + 'px',
    }));

    const valueStyle = computed(() => ({
      color: props.content?.valueTextColor || '#111827',
      fontSize: (props.content?.fontSize || 14) + 'px',
    }));

    const checkedBoxStyle = computed(() => ({
      backgroundColor: resolvedPrimaryColor.value,
      borderColor: resolvedPrimaryColor.value,
    }));

    const uncheckedBoxStyle = computed(() => ({
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
    }));

    const emptyStateStyle = computed(() => ({
      color: props.content?.labelTextColor || '#6b7280',
      fontSize: (props.content?.fontSize || 14) + 'px',
    }));

    const getAiPolicyText = (mode) => {
      const m = String(mode || '').trim();
      if (m === 'Enabled') return 'Deep scan (content analysis)';
      if (m === 'Metadata') return 'Quick scan (metadata only)';
      return 'Disabled';
    };

    const getAiPolicyIcon = (mode) => {
      const m = String(mode || '').trim();
      if (m === 'Enabled') return '🔍';
      if (m === 'Metadata') return '⚡';
      return '';
    };

    const handleOpen = (item) => {
      const payload = item?._original || item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'open-click', event: { folder: payload } });
    };

    const handleEdit = (item) => {
      const payload = item?._original || item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'edit-click', event: { folder: payload } });
    };

    const handleNameClick = (item) => {
      const payload = item?._original || item;
      setSelectedItem(payload);
      emit('trigger-event', { name: 'name-click', event: { folder: payload } });
    };

    return {
      processedItems,
      filteredItems,
      searchQuery,
      portalFilter,
      handleSearchInput,
      handlePortalChange,
      handleReset,
      containerStyle,
      cardStyle,
      getOpenButtonStyle,
      getEditButtonStyle,
      folderNameStyle,
      labelStyle,
      valueStyle,
      checkedBoxStyle,
      uncheckedBoxStyle,
      emptyStateStyle,
      getAiPolicyText,
      getAiPolicyIcon,
      handleOpen,
      handleEdit,
      handleNameClick,
      setHover,
      setActive,
      selectedItem,
      itemCount,
      filteredCount,
      props,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style scoped>
.folder-card-list {
  width: 100%;
  box-sizing: border-box;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.filter-search-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.filter-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  pointer-events: none;
  line-height: 1;
}

.filter-input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px 7px 30px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  outline: none;
  font-family: inherit;
}

.filter-input:focus {
  border-color: #2d6a4f;
}

.filter-select {
  flex-shrink: 0;
  padding: 7px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  max-width: 130px;
}

.filter-select:focus {
  border-color: #2d6a4f;
}

.filter-reset {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #2d6a4f;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 2px;
  font-family: inherit;
  white-space: nowrap;
  text-decoration: underline;
}

.filter-reset:hover {
  color: #1a4a35;
}

/* Cards */
.folder-card {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--fcl-card-bg, #ffffff);
  border: 1px solid var(--fcl-card-border, #e5e7eb);
  border-radius: var(--fcl-card-radius, 8px);
  font-size: var(--fcl-font-size, 14px);
}

.card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border-radius: 999px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.btn-open {
  border: 1.5px solid transparent;
}

.btn-edit {
  border: 1.5px solid;
}

.folder-name-field {
  margin-top: 2px;
}

.folder-name {
  color: var(--fcl-name-color, #2d6a4f);
  font-size: var(--fcl-font-size, 14px);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  display: inline;
}

.card-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 22px;
}

.field-label {
  color: var(--fcl-label-color, #6b7280);
  font-size: var(--fcl-font-size, 14px);
  font-weight: 400;
  flex-shrink: 0;
}

.field-value {
  color: var(--fcl-value-color, #111827);
  font-size: var(--fcl-font-size, 14px);
  font-weight: 500;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-policy-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-policy-icon {
  font-size: 1em;
  line-height: 1;
  flex-shrink: 0;
}

.checkbox-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.checkbox-box {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1.5px solid #d1d5db;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  pointer-events: none;
  user-select: none;
}

.empty-state {
  width: 100%;
  padding: 32px 16px;
  text-align: center;
  color: var(--fcl-label-color, #6b7280);
  font-size: var(--fcl-font-size, 14px);
  box-sizing: border-box;
}
</style>
