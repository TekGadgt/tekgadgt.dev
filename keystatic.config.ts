import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'OWNER/REPO', // TODO: replace with actual repo
      },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/homepage',
      format: { data: 'json' },
      schema: {
        heroHeading: fields.text({ label: 'Hero Heading' }),
        tagline: fields.text({ label: 'Tagline' }),
        bioText: fields.text({ label: 'Bio Text', multiline: true }),
        primaryCtaLabel: fields.text({ label: 'Primary CTA Label' }),
        primaryCtaUrl: fields.text({ label: 'Primary CTA URL' }),
        secondaryCtaLabel: fields.text({ label: 'Secondary CTA Label' }),
        secondaryCtaUrl: fields.text({ label: 'Secondary CTA URL' }),
        metaDescription: fields.text({ label: 'Meta Description', multiline: true }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about',
      format: { contentField: 'content' },
      schema: {
        metaDescription: fields.text({ label: 'Meta Description', multiline: true }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    appearances: singleton({
      label: 'Appearances',
      path: 'src/content/appearances',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            type: fields.select({
              label: 'Type',
              options: [
                { label: 'Talk', value: 'talk' },
                { label: 'Interview', value: 'interview' },
                { label: 'Podcast', value: 'podcast' },
                { label: 'Article', value: 'article' },
              ],
              defaultValue: 'talk',
            }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            outlet: fields.text({ label: 'Outlet/Event' }),
            date: fields.date({ label: 'Date' }),
            url: fields.url({ label: 'URL' }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Appearances',
            itemLabel: (props) => props.fields.title.value || 'New Appearance',
          }
        ),
      },
    }),
    projects: singleton({
      label: 'Projects',
      path: 'src/content/projects',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            description: fields.text({ label: 'Description', multiline: true }),
            url: fields.url({ label: 'URL' }),
            techTags: fields.array(
              fields.text({ label: 'Tag' }),
              { label: 'Tech Tags', itemLabel: (props) => props.value || 'New Tag' }
            ),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Projects',
            itemLabel: (props) => props.fields.name.value || 'New Project',
          }
        ),
      },
    }),
    community: singleton({
      label: 'Community',
      path: 'src/content/community',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            orgName: fields.text({ label: 'Organization', validation: { isRequired: true } }),
            role: fields.text({ label: 'Role' }),
            description: fields.text({ label: 'Description', multiline: true }),
            url: fields.url({ label: 'URL' }),
            status: fields.select({
              label: 'Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Past', value: 'past' },
              ],
              defaultValue: 'active',
            }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Community Roles',
            itemLabel: (props) => props.fields.orgName.value || 'New Role',
          }
        ),
      },
    }),
    experience: singleton({
      label: 'Experience',
      path: 'src/content/experience',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            company: fields.text({ label: 'Company', validation: { isRequired: true } }),
            role: fields.text({ label: 'Role', validation: { isRequired: true } }),
            startDate: fields.date({ label: 'Start Date' }),
            endDate: fields.date({ label: 'End Date' }),
            location: fields.text({ label: 'Location' }),
            employmentType: fields.text({ label: 'Employment Type' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            impact: fields.array(
              fields.text({ label: 'Impact' }),
              { label: 'Impact Items', itemLabel: (props) => props.value || 'New Impact' }
            ),
            tech: fields.array(
              fields.text({ label: 'Technology' }),
              { label: 'Technologies', itemLabel: (props) => props.value || 'New Tech' }
            ),
            url: fields.url({ label: 'URL' }),
            featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
          }),
          {
            label: 'Experience',
            itemLabel: (props) => {
              const company = props.fields.company.value;
              const role = props.fields.role.value;
              return company && role ? `${role} @ ${company}` : 'New Position';
            },
          }
        ),
      },
    }),
    now: singleton({
      label: 'Now',
      path: 'src/content/now',
      format: { contentField: 'content' },
      schema: {
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    uses: singleton({
      label: 'Uses',
      path: 'src/content/uses',
      format: { data: 'json' },
      schema: {
        categories: fields.array(
          fields.object({
            name: fields.text({ label: 'Category Name', validation: { isRequired: true } }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: 'Name', validation: { isRequired: true } }),
                description: fields.text({ label: 'Description' }),
                url: fields.url({ label: 'URL' }),
              }),
              {
                label: 'Items',
                itemLabel: (props) => props.fields.name.value || 'New Item',
              }
            ),
          }),
          {
            label: 'Categories',
            itemLabel: (props) => props.fields.name.value || 'New Category',
          }
        ),
      },
    }),
    footer: singleton({
      label: 'Footer',
      path: 'src/content/footer',
      format: { data: 'json' },
      schema: {
        email: fields.text({ label: 'Email' }),
        calUrl: fields.url({ label: 'Cal.com URL' }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform Name', validation: { isRequired: true } }),
            url: fields.url({ label: 'URL', validation: { isRequired: true } }),
            icon: fields.text({ label: 'Icon Identifier' }),
          }),
          {
            label: 'Social Links',
            itemLabel: (props) => props.fields.platform.value || 'New Link',
          }
        ),
      },
    }),
    buttonWall: singleton({
      label: 'Button Wall',
      path: 'src/content/buttonWall',
      format: { data: 'json' },
      schema: {
        buttons: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', validation: { isRequired: true } }),
            image: fields.image({
              label: 'Button Image (88x31)',
              directory: 'public/images/buttons',
              publicPath: '/images/buttons/',
            }),
            url: fields.url({ label: 'URL' }),
            group: fields.select({
              label: 'Group',
              options: [
                { label: 'Mine', value: 'mine' },
                { label: 'Friends', value: 'friends' },
              ],
              defaultValue: 'mine',
            }),
            active: fields.checkbox({ label: 'Active', defaultValue: true }),
          }),
          {
            label: 'Buttons',
            itemLabel: (props) => props.fields.label.value || 'New Button',
          }
        ),
      },
    }),
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*/',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (props) => props.value || 'New Tag' }
        ),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
